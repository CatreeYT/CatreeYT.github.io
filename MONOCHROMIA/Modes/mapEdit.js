let mapEditingData = {
    map: [[],[]],
    spX: 0, spY: 0,
    interval: 60,
    objectType: 0,
    selecting: -1,
    copied: [],
    selectionOptions: [
        "Block",
        "SpikeUp",
        "Doorway",
        "Spawn",
        "Text",
    ]
}
// Enter as... [
// (num) Type [Block, Spike, Doorway]
// X
// Y
// Extra data (ie width)
// ]

function convertEditDataToMap(m, interval){
    let generatedMap = map([], [], interval, 0, 0)
    for(let i = 0; i < m[0].length; ++i){
        let c = m[0][i];
        switch(c[0]){
            case 0: {
                generatedMap.map[0].push(new block(c[1], c[2], c[3], c[4]))
                break;
            }
            case 1: {
                generatedMap.map[0].push(spike(c[1], c[2]))
                break;
            }
            case 2: {
                generatedMap.map[0].push(doorway(c[1], c[2]))
                break;
            }
            case 3: {
                generatedMap.spawnX = c[1]
                generatedMap.spawnY = c[2]
                break;
            }
            case 4: {
                generatedMap.map[0].push(textObj(c[1], c[2], c[3], c[4]))
                break;
            }
        }
    }
    for(let i = 0; i < m[1].length; ++i){
        let c = m[1][i];
        switch(c[0]){
            case 0: {
                generatedMap.map[1].push(new block(c[1], c[2], c[3], c[4], 0.4, new colorObj(0, 0, 0)))
                break;
            }
            case 1: {
                generatedMap.map[1].push(spike(c[1], c[2]))
                break;
            }
            case 2: {
                generatedMap.map[1].push(doorway(c[1], c[2]))
                break;
            }
            // DO NOT ADD SPAWNPOINT HERE
            case 4: {
                generatedMap.map[1].push(textObj(c[1], c[2], c[3], c[4]))
                break;
            }
        }
    }
    return generatedMap
}
function addObjectToMap(type, x, y, ...additionalArgs){
    let newObject = [type, x, y]
    newObject.push(...additionalArgs)
    mapEditingData.map[lightState].push(newObject)
}
function renderEditingMap(){
    let currentlyEditing = mapEditingData.map[lightState]
    for(let i = 0; i < currentlyEditing.length; ++i){
        switch(currentlyEditing[i][0]){
            case 0: {
                fill(colorWvB[1-lightState])
                rect(currentlyEditing[i][1], currentlyEditing[i][2], currentlyEditing[i][3], currentlyEditing[i][4])
                if(i === mapEditingData.selecting){
                    fill(128, 128, 128)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], currentlyEditing[i][3], 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2] + currentlyEditing[i][4]-2, currentlyEditing[i][3], 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 2, currentlyEditing[i][4])
                    rect(currentlyEditing[i][1] + currentlyEditing[i][3]-2, currentlyEditing[i][2], 2, currentlyEditing[i][4])
                }
                break;
            }
            case 1: {
                renderSpike(currentlyEditing[i][1], currentlyEditing[i][2])
                if(i === mapEditingData.selecting){
                    fill(128, 128, 128)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 32, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2] + 8, 32, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 2, 10)
                    rect(currentlyEditing[i][1] + 30, currentlyEditing[i][2], 2, 10)
                }
                break;
            }
            case 2: {
                doorwaySprite.draw(currentlyEditing[i][1], currentlyEditing[i][2], 2, 2, 0, 0)
                if(i === mapEditingData.selecting){
                    fill(128, 128, 128)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 32, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2] + 46, 32, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 2, 48)
                    rect(currentlyEditing[i][1] + 30, currentlyEditing[i][2], 2, 48)
                }
                break;
            }
            case 3: {
                fill(colorWvB[1-lightState])
                rect(currentlyEditing[i][1], currentlyEditing[i][2], player.width, player.height)
                fontSize(15)
                fillText("SPAWN", currentlyEditing[i][1], currentlyEditing[i][2]-5)
                if(i === mapEditingData.selecting){
                    fill(128, 128, 128)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], player.width, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2] + player.height-2, player.width, 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2], 2, player.height)
                    rect(currentlyEditing[i][1] + player.width-2, currentlyEditing[i][2], 2, player.height)
                }
                break;
            }
            case 4: {
                fill(colorWvB[1-lightState])
                fontSize(currentlyEditing[i][4])
                fillText(currentlyEditing[i][3], currentlyEditing[i][1], currentlyEditing[i][2])
                if(i === mapEditingData.selecting){
                    fill(128, 128, 128)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2]-currentlyEditing[i][4], currentlyEditing[i][4], 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2] -2, currentlyEditing[i][4], 2)
                    rect(currentlyEditing[i][1], currentlyEditing[i][2]-currentlyEditing[i][4], 2, currentlyEditing[i][4])
                    rect(currentlyEditing[i][1] + currentlyEditing[i][4]-2, currentlyEditing[i][2]-currentlyEditing[i][4], 2, currentlyEditing[i][4])
                }
                break;
            }
        }
    }
}
function runMapEdit(){
    background(colorWvB[lightState])
    mapEditExtraControls()
    renderEditingMap()
    fill(colorWvB[1-lightState])
    fontSize(15)
    fillText("Current Object Count: " + mapEditingData.map[lightState].length, 10, 20)
    fillText("Currently Copied: [" + mapEditingData.copied + "]", 10, 40)
    fillText("Object Type: " + mapEditingData.selectionOptions[mapEditingData.objectType], 10, 60)
    fillText("Shift:" + pressing["Shift"] + ", Other:" + pressing.s, 10, 80)
}
function mouseTouching(x, y, w, h){
    return touching(x, y, w, h, mouseX, mouseY, 1, 1)
}
function swapToGameplay(){
    currentMode = 0
    lightState = 0
    lightTimer = 0
    player.x = player.spawnX
    player.y = player.spawnY
    player.fs = 0;
    player.hs = 0;
}
function isJSON(text){
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}
function mapEditExtraControls(){
    // Change back to game
    if(inputStart["z"]){
        mapEditingData.selecting = -1;
        swapToGameplay()
    }

    // Test (goes back to game)
    if(inputStart["t"]){
        mapEditingData.selecting = -1;
        swapMap(convertEditDataToMap(mapEditingData.map, mapEditingData.interval))
        swapToGameplay()
    }
    if(inputStart["p"]){
        navigator.clipboard.writeText("maps.push(convertEditDataToMap(" + JSON.stringify(mapEditingData.map) + "," + mapEditingData.interval + "));")
    }

    // Delete Object
    if(inputStart["x"] && mapEditingData.selecting > -1){
        mapEditingData.map[lightState].splice(mapEditingData.selecting, 1)
        mapEditingData.selecting = -1
    }
    // Duplicate
    if(inputStart["b"] && mapEditingData.selecting > -1){
        let selected = mapEditingData.map[lightState][mapEditingData.selecting]
        addObjectToMap.apply(null, selected)
        mapEditingData.selecting = mapEditingData.map[lightState].length-1
    }

    // Copy Data
    if(inputStart["c"] && mapEditingData.selecting !== -1){
        mapEditingData.copied = [...mapEditingData.map[lightState][mapEditingData.selecting]]
    }
    // Paste
    if(inputStart["v"] && mapEditingData.copied){
        addObjectToMap.apply(null, mapEditingData.copied)
        mapEditingData.selecting = mapEditingData.map[lightState].length-1
    }

    // Inverse Object Swap
    if(inputStart["q"]){
        --mapEditingData.objectType;
        if(mapEditingData.objectType < 0){
            mapEditingData.objectType = mapEditingData.selectionOptions.length-1
        }
    }
    // Object Swap
    if(inputStart["e"]){
        ++mapEditingData.objectType;
        if(mapEditingData.objectType >= mapEditingData.selectionOptions.length){
            mapEditingData.objectType = 0
        }
    }

    // Swap light state
    if(inputStart["f"]){
        lightState = 1 - lightState
        mapEditingData.selecting = -1
    }
    // Inspect (Change data other than movement)
    if(inputStart["i"]){
        let a
        if(mapEditingData.selecting === -1){
            // Change Interval
            while(a !== null && !Number(a)){
                a = prompt("Change Interval (currently=" + mapEditingData.interval + ")")
            }
            if(a !== null){
                mapEditingData.interval = Number(a);
            }
            
        } else if(mapEditingData.map[lightState][mapEditingData.selecting][0] === 4){
            // Change Text
            a = prompt("Change Text (currently=" + mapEditingData.map[lightState][mapEditingData.selecting][3] + ")")
            if(a !== null){
                mapEditingData.map[lightState][mapEditingData.selecting][3]= a;
            }
        }
    }
    if(inputStart["u"]){
        let a
        if(mapEditingData.selecting === -1){
            // Import Map
            a = prompt("Import Map (CHANGE PARENTHESES TO [])")
            while(a !== null && !isJSON(a)){
                a = prompt("Import Map (CHANGE PARENTHESES TO [])")
            }
            if(a !== null){
                let n = JSON.parse(a);
                mapEditingData.map = n[0]
                mapEditingData.interval = n[1]
            }
        } else if(mapEditingData.map[lightState][mapEditingData.selecting][0] === 4){
            // Change Font Size
            while(a !== null && !Number(a)){
                a = prompt("Change Font Size (currently=" + mapEditingData.map[lightState][mapEditingData.selecting][4] + ")")
            }
            if(a !== null){
                mapEditingData.map[lightState][mapEditingData.selecting][4] = Number(a);
            }
        }
    }
    
    // Add Object
    if(inputStart["n"]){
        switch(mapEditingData.objectType){
            case 0: {
                addObjectToMap(mapEditingData.objectType, mouseX, mouseY, 40, 40)
                break;
            }
            case 1: {
                addObjectToMap(mapEditingData.objectType, mouseX, mouseY)
                break;
            }
            case 2: {
                addObjectToMap(mapEditingData.objectType, mouseX, mouseY)
                break;
            }
            case 3: {
                addObjectToMap(mapEditingData.objectType, mouseX, mouseY)
                break;
            }
            case 4: {
                addObjectToMap(mapEditingData.objectType, mouseX, mouseY, "DefaultText", 24)
                break;
            }
        }
    }
    // Select Object
    if(mouseClickBegan){
        let currentlyEditing = mapEditingData.map[lightState]
        mapEditingData.selecting = -1
        loop: for(let i = 0; i < currentlyEditing.length; ++i){
            switch(currentlyEditing[i][0]) {
                case 0: {
                    if(mouseTouching(currentlyEditing[i][1], currentlyEditing[i][2], currentlyEditing[i][3], currentlyEditing[i][4])){
                        mapEditingData.selecting = i;
                        break loop;
                    }
                    break;
                }
                case 1: {
                    if(mouseTouching(currentlyEditing[i][1], currentlyEditing[i][2], 32, 10)){
                        mapEditingData.selecting = i;
                        break loop;
                    }
                    break;
                }
                case 2: {
                    if(mouseTouching(currentlyEditing[i][1], currentlyEditing[i][2], 32, 48)){
                        mapEditingData.selecting = i;
                        break loop;
                    }
                    break;
                }
                case 3: {
                    if(mouseTouching(currentlyEditing[i][1], currentlyEditing[i][2], player.width, player.height)){
                        mapEditingData.selecting = i;
                        break loop;
                    }
                    break;
                }
                case 4: {
                    if(mouseTouching(currentlyEditing[i][1], currentlyEditing[i][2] - currentlyEditing[i][4], currentlyEditing[i][4], currentlyEditing[i][4])){
                        mapEditingData.selecting = i;
                        break loop;
                    }
                    break;
                }
            }
        }
    }

    // Move with Mouse
    if(mouseDown && mapEditingData.selecting !== -1){
        let currentlyEditing = mapEditingData.map[lightState][mapEditingData.selecting]
        if(!pressing["Shift"]){
            currentlyEditing[1] += mouseX-pMouseX
            currentlyEditing[2] += mouseY-pMouseY
        } else {
            if(currentlyEditing[0] === 0){
                currentlyEditing[3] += mouseX-pMouseX
                currentlyEditing[4] += mouseY-pMouseY
            }
        }
    }

    //  Move with arrows
    if((inputStart[LEFT] || pressing["a"]) && mapEditingData.selecting !== -1){
        let currentlyEditing = mapEditingData.map[lightState][mapEditingData.selecting]
        if(!pressing["Shift"]){
            currentlyEditing[1] -= 1
        } else {
            if(currentlyEditing[0] === 0){
                currentlyEditing[3] -= 1
            }
        }
    }
    if((inputStart[RIGHT] || pressing["d"]) && mapEditingData.selecting !== -1){
        let currentlyEditing = mapEditingData.map[lightState][mapEditingData.selecting]
        if(!pressing["Shift"]){
            currentlyEditing[1] += 1
        } else {
            if(currentlyEditing[0] === 0){
                currentlyEditing[3] += 1
            }
        }
    }
    if((inputStart[UP] || pressing["w"]) && mapEditingData.selecting !== -1){
        let currentlyEditing = mapEditingData.map[lightState][mapEditingData.selecting]
        if(!pressing["Shift"]){
            currentlyEditing[2] -= 1
        } else {
            if(currentlyEditing[0] === 0){
                currentlyEditing[4] -= 1
            }
        }
    }
    if((inputStart[DOWN] || pressing["s"]) && mapEditingData.selecting !== -1){
        let currentlyEditing = mapEditingData.map[lightState][mapEditingData.selecting]
        if(!pressing["Shift"]){
            currentlyEditing[2] += 1
        } else {
            if(currentlyEditing[0] === 0){
                currentlyEditing[4] += 1
            }
        }
    }
}