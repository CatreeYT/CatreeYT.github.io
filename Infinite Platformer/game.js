/*
This is a platformer game that has infinite Areas

Arrow Keys to move

If an area turns out to be impossible
you can click to go to that spot
---------------------------------------
Have fun playing the worst levels ever!
*/

var seed = 0;
var usedTPs = 0;
var area = 1;
randomSeed(seed);
var levelDims = width * 0.05;
function touching(x, y, w, h, test_x, test_y, test_w, test_h){
    if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
    if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
    return test_x + test_w > x && test_x < x + w && test_y + test_h > y && test_y < y + h;
}

var tiles = [
    color(255, 0, 0), // Death
    color(212, 102, 0), // Dirt
    color(9, 255, 0), // Grass
    color(255, 0, 230), // Bounce
    color(221, 255, 0), // Ladder
    color(184, 184, 184), // DS on
    color(105, 105, 105), // DS off
    color(255, 162, 0), // Death (ds on)
    color(255, 162, 0), // Death (ds off)
];

var deathSwitch = false;

function randomInt(min, max){
    return floor(random(min, max));
}

var smallPlatform = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [2, 2, 2],
    [1, 1, 1],
];
var deathPit = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [0, 0, 0],
];
var air = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
];
var wall = [
    [1, 1],
    [1, 1],
    [1, 1],
    [1, 1],
];
var bounce = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [3, 3, 3],
    [1, 1, 1],
];
var ladder = [
    [-2, -2, 4, 1],
    [-2, -2, 4, 1],
    [-2, -2, 4, 1],
    [-2, -2, 4, 1],
    [-2, -2, 4, 1],
    ];
var onSwitch = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, 5, -2],
    [2, 2, 2],
    [1, 1, 1],
];
var offSwitch = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, 6, -2],
    [2, 2, 2],
    [1, 1, 1],
];
var deathPitDSon = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [7, 7, 7],
];
var deathPitDSoff = [
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [-2, -2, -2],
    [8, 8, 8],
];

var prefabs = [
    smallPlatform,
    deathPit,
    air,
    wall,
    bounce,
    ladder,
    onSwitch,
    offSwitch,
    deathPitDSon,
    deathPitDSoff
];

var chances = [
    1.0, // Small Platform
    0.8, // Death Pit
    1.5, // Air
    0.6, // Wall
    0.6, // Bounce
    0.6, // Ladder
    0.5, // onSwitch
    0.5, // offSwitch
    0.5, // death pit (only on death switch on)
    0.5, // death pit (only on death switch off)
];

var chancesSum = 0;

for(var i = 0; i < chances.length; ++i){
    chancesSum += chances[i];
}

function generateLevel(w, h, seed){
    var testLv = [];
    for(var i = 0; i < w; ++i){
        testLv.push([]);
        for(var j = 0; j < h; ++j){
            testLv[i].push(-1);
        }
    }
    function createRandomLevelObject(i, j){
        var chosenPrefabID;
        var chosenChances = [];
        for(var n = 0; n < chances.length; ++n){
            chosenChances.push(random(0, chances[n]));
        }
        var maxOfChances = 0;
        for(var n = 0; n < chosenChances.length; ++n){
            maxOfChances = max(maxOfChances, chosenChances[n]);
        }
        for(var n = 0; n < chosenChances.length; ++n){
            if(chosenChances[n] === maxOfChances){
                chosenPrefabID = n;
                break;
            }
        }
        for(var cols = 0; cols < prefabs[chosenPrefabID].length; ++cols){
            for(var rows = 0; rows < prefabs[chosenPrefabID][cols].length; ++rows){
                if(i + rows < w && j + cols < h && testLv[i + rows][j + cols] !== -1){
                    return;
                }
            }
        }
        
        for(var cols = 0; cols < prefabs[chosenPrefabID].length; ++cols){
            for(var rows = 0; rows < prefabs[chosenPrefabID][cols].length; ++rows){
                if(i + rows < w && j + cols < h && testLv[i + rows][j + cols] === -1){
                    testLv[i + rows][j + cols] = prefabs[chosenPrefabID][cols][rows];
                }
            }
        }
    }
    for(var i = 0; i < w; ++i){
        for(var j = 0; j < h; ++j){
            createRandomLevelObject(i, j);
            //testLv[i][j] = randomInt(-1, 3);
        }
    }
    return testLv;
}
var player = {
    x: 0,
    y: 0,
    fs: 0,
    screenScroll: 0,
};

var checkOrder = [
        1, // Dirt
        3, // Bounce
        0, // Death
        7, // Death DS on
        8, // Death DS off
        2, // Grass
        4, // Ladder
        5, // DS on
        6, // DS off
    ];
    
var screen1 = generateLevel(levelDims, levelDims, seed);
var screen2 = generateLevel(levelDims, levelDims, seed);
var screen3 = generateLevel(levelDims, levelDims, seed);
    
var screens = [screen1, screen2, screen3];    

var screen = 0;
var xRelToScreen = 0;
var level = generateLevel(levelDims, levelDims, seed);
noStroke();
draw = function() {
    screen = floor(player.x / width);
    xRelToScreen = player.x - screen * width;
    pushMatrix();
    if(player.x - player.screenScroll > (width * 0.5 - 10)){
        player.screenScroll = player.x - (width * 0.5 - 10);
    }
    translate(-player.screenScroll, 0);
    if(pressing[UP] && player.fs === 0){
        player.fs = -3;
    }
    
    player.y += player.fs;
    player.fs += 0.1;
    
    if(pressing[RIGHT]){player.x += 2;}
    if(pressing[LEFT]){player.x -= 2;}
    
    background(0, 225, 250);
    /*
    for(var i = 0; i < level.length; ++i){
        for(var j = 0; j < level[i].length; ++j){
            if(level[i][j] !== -1 && level[i][j] !== -2){
                fill(tiles[level[i][j]]);
                rect(i * 20, j * 20, 20, 20);
            }
        }
    }
    */
    for(var s = 0; s < screens.length; ++s){
        for(var i = 0; i < levelDims; ++i){
            for(var j = 0; j < levelDims; ++j){
                var l = screens[s];
                if(l[i][j] !== -1 && l[i][j] !== -2 && l[i][j] !== 7 && l[i][j] !== 8){
                    fill(tiles[l[i][j]]);
                    rect(i * 20 + (width * s), j * 20, 20, 20);
                }
                if(l[i][j] === 7 && deathSwitch){
                    fill(tiles[l[i][j]]);
                    rect(i * 20 + (width * s), j * 20, 20, 20);
                }
                if(l[i][j] === 8 && !deathSwitch){
                    fill(tiles[l[i][j]]);
                    rect(i * 20 + (width * s), j * 20, 20, 20);
                }
            }
        }
    }
    for(var s = 0; s < screens.length; ++s){
        var l = screens[s];
    for(var checkFor = 0; checkFor < checkOrder.length; ++checkFor){
        for(var i = 0; i < l.length; ++i){
            for(var j = 0; j < l[i].length; ++j){
                if(touching(i * 20 + (width * s), j * 20, 20, 20, player.x, player.y, 20, 20) && l[i][j] === checkFor){
                    switch(l[i][j]){
                        case 0: {
                            player.y = 0;
                            player.x = 0;
                            player.fs = 0;
                            player.screenScroll = 0;
                            //level = generateLevel(levelDims, levelDims, seed);
                            break;
                        }
                        case 1: {
                            if(player.fs > 0 && touching(i * 20 + (width * s), j * 20, 20, 5, player.x, player.y + 15, 20, 5) && l[i][max(0, j - 1)] !== 1 && l[i][max(0, j - 1)] !== 2){
                                player.fs = 0;
                                player.y -= 0.5;
                            } else if (player.fs < 0 && touching(i * 20 + (width * s), j * 20 + 15, 20, 5, player.x, player.y, 20, 5) && l[i][min(19, j + 1)] !== 1 && l[i][min(19, j + 1)] !== 2) {
                                player.fs = 0.2;
                                player.y = j * 20 + 20;
                                
                            } else {
                            if(pressing[RIGHT]){player.x -= 2;}
                            if(pressing[LEFT]){player.x += 2;}
                            }
                            break;
                        }
                        case 2: {
                            if(player.fs > 0 && touching(i * 20 + (width * s), j * 20, 20, 5, player.x, player.y + 15, 20, 5) && l[i][max(0, j - 1)] !== 1 && l[i][max(0, j - 1)] !== 2){
                                player.fs = 0;
                                player.y -= 0.5;
                            } else if (player.fs < 0 && touching(i * 20 + (width * s), j * 20 + 15, 20, 5, player.x, player.y, 20, 5) && l[i][min(19, j + 1)] !== 1 && l[i][min(19, j + 1)] !== 2) {
                                player.fs = 0.2;
                                
                            } else {
                            if(pressing[RIGHT]){player.x -= 2;}
                            if(pressing[LEFT]){player.x += 2;}
                            }
                            break;
                        }
                        case 3: {
                            player.fs = -5;
                            break;
                        }
                        case 4: {
                            if(player.fs > 0 && touching(i * 20 + (width * s), j * 20, 20, 5, player.x, player.y + 15, 20, 5) && l[i][max(0, j - 1)] !== 1 && l[i][max(0, j - 1)] !== 2){
                                player.fs = 0;
                                player.y -= 0.5;
                            } else if (player.fs < 0 && touching(i * 20 + (width * s), j * 20 + 15, 20, 5, player.x, player.y, 20, 5) && l[i][min(19, j + 1)] !== 1 && l[i][min(19, j + 1)] !== 2) {
                                player.fs = 0.2;
                                
                            } else {
                            player.fs = -1;
                            if(pressing[RIGHT]){player.x -= 2;}
                            if(pressing[LEFT]){player.x += 2;}
                            }
                            break;
                        }
                        case 5: {
                            deathSwitch = true;
                            break;
                        }
                        case 6: {
                            deathSwitch = false;
                            break;
                        }
                        case 7: {
                            if(deathSwitch){
                            player.y = 0;
                            player.x = 0;
                            player.fs = 0;
                            player.screenScroll = 0;
                            }
                            break;
                        }
                        case 8: {
                            if(!deathSwitch){
                            player.y = 0;
                            player.x = 0;
                            player.fs = 0;
                            player.screenScroll = 0;
                            }
                            break;
                        }
                    }
                }
            }
    }
    }
    }
    
    if(player.y > height){
        player.y = 0;
        player.x = 0;
        player.fs = 0;
        player.screenScroll = 0;
    }
    fill(255, 255, 255);
    rect(player.x, player.y, 20, 20);
    popMatrix();
    if(screen === 1 && xRelToScreen > (width * 0.5 - 10)){
        player.x -= width;
        screens[0] = screens[1];
        screens[1] = screens[2];
        screens[2] = generateLevel(levelDims, levelDims, seed);
        player.screenScroll = player.x - (width * 0.5 - 10);
        ++area;
    }
};

function keyPressed(key){
    if(key === "r"){
        player.y = 0;
        player.x = 0;
        player.fs = 0;
        player.screenScroll = 0;
    }
}
function keyReleased(){
    
}
function mouseClicked(){
    player.x = mouseX - 10 + player.screenScroll;
    player.y = mouseY - 10;
    player.fs = 0;
    ++usedTPs;
}