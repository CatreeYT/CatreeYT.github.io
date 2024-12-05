function renderSpike(x, y){
    spikes[lightState].draw(x, y, 2, 2, false, false)
}
function spike(x, y){
    let sp = new block(x, y, 32, 10, 0, {draw: renderSpike, ready: true}, undefined, function(){if(this.collidingWithPlayer()){player.die()}})
    sp.sidesColliding = 0
    return sp;
}

function runDoorwayCode(){
    if(inputStart[binds.enterDoorway] && player.coyoteFramesLeft > 0 && this.collidingWithPlayer()){
        ++currentLevelIdx;
        swapMap(maps[currentLevelIdx]);
    }
}
function doorway(x, y){
    let d = new block(x, y, 32, 48, 0, doorwaySprite, function(){}, runDoorwayCode)
    d.sidesColliding = 0
    return d;
}

function textObj(x, y, appliedText, size=25){
    let t = new block(x, y, 32, 48, 0, {draw: function(x, y){fill(colorWvB[1-lightState]); fontSize(size); fillText(appliedText, x, y)}, ready: true}, function(){}, function(){})
    t.sidesColliding = 0;
    return t;
}