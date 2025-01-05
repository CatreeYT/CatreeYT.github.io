player.die = function(){
    if(player.animType !== -1){
        player.animType = -1;
        player.animFrame = 0;
        time.timers.push([function(){
            player.x = player.spawnX;
            player.y = player.spawnY;
            player.fs = 0;
            player.hs = 0;
            tickImageState = 0;
            lightState = 0;
            lightTimer = 0;
            level = currentFullLevel[lightState]
            player.animType = 0
        }, 40])
    }
};

function runTimer(){
    ++lightTimer
    if(lightTimer >= lightTimerChangeInterval){
        ++tickImageState;
        lightTimer = 0;
    }
    if(tickImageState >= tickImages.length){
        tickImageState = 0
        lightState = 1 - lightState;
        level = currentFullLevel[lightState]
        player.height -= 2;
        ++player.y;
        for(let i = 0; i < level.length; ++i){
            if(level[i].sidesColliding !== 0 && level[i].collidingWithPlayer()){
                player.die()
                break;
            }
        }
        player.height += 2;
        --player.y;
    }

    tickImages[tickImageState].draw(0, 0, 2, 2)
    tickLight[lightState].draw(32, 15, 4, 4)
}
function decideAnimState(){
    if(player.animType !== -1){
        if(player.coyoteFramesLeft > 0){
            if(abs(player.hs) < 0.05){
                player.animType = 0;
                player.animFrame += idleAnimSpeed
                player.animFrame %= plrAnimIdle.length
            } else {
                player.animType = 1;
                player.animFrame += walkAnimSpeed
                player.animFrame %= plrAnimWalk.length
            }
        } else {
            if(player.fs < 0){
                player.animType = 2;
                player.animFrame = 0;
            } else {
                player.animType = 3;
                player.animFrame = 0;
            }
        }
    }
}
function renderPlayer(){
    //fill(255, 0, 0)
    if(player.animType !== -1){
        fill(colorWvB[1-lightState])
        //rect(player.x, player.y, player.width, player.height)
        switch(player.animType){
            case 0: {
                plrAnimIdle[floor(player.animFrame)].draw(player.x + Number(player.direction === -1) * facingLeftExtraMovement, player.y, 1.5, 1.5, (player.direction === -1), 0)
                break;
            }
            case 1: {
                plrAnimWalk[floor(player.animFrame)].draw(player.x + Number(player.direction === -1) * facingLeftExtraMovement, player.y, 1.5, 1.5, (player.direction === -1), 0)
                break;
            }
            case 2: {
                plrAnimJump.draw(player.x + Number(player.direction === -1) * facingLeftExtraMovement, player.y, 1.5, 1.5, (player.direction === -1), 0)
                break;
            }
            case 3: {
                plrAnimFall.draw(player.x + Number(player.direction === -1) * facingLeftExtraMovement, player.y, 1.5, 1.5, (player.direction === -1), 0)
                break;
            }
        }
    } else {
        player.animFrame += 0.2;
        if(player.animFrame < plrAnimDie.length){
            plrAnimDie[floor(player.animFrame)][lightState].draw(player.x, player.y, 2, 2, 0, 0)
        }
    }
}
function runGameplay(){
    background(colorWvB[lightState])
    decideAnimState()
    if(player.y >= height - 40){
        player.die()
    }
    runTimer()
    if(player.animType !== -1){
        doControls()
    }
    doLevel()
    renderPlayer()
}
function gameplayExtraControls(){
    if(inputStart["r"]){
        player.die()
    }
    if(inputStart["q"]){
        --currentLevelIdx;
        swapMap(maps[currentLevelIdx])
    }
    if(inputStart["e"]){
        ++currentLevelIdx;
        swapMap(maps[currentLevelIdx])
    }
    if(inputStart["z"]){
        currentMode = 1
        lightState = 0;
    }
}