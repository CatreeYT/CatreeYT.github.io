let currentMode = 2;
// Gameplay = 0
// Map Editing = 1
// Menu = 2

player.jumpForce = 5
player.extraPixelsStanding = 1
player.endJumpDamp = 0.5
player.endJumpPrematureDamp = 0.25

player.width = 12
player.height = 30

player.animFrame = 0;
player.animType = 0;

GRAVITY = 0.1

binds.enterDoorway = " "

let currentTickImage;

let colorWvB = [new colorObj(0, 0, 0), new colorObj(255, 255, 255)]

let tickImageState = 0;
let lightState = 0;
let lightTimer = 0;
let lightTimerChangeInterval = 60;

let maps = []
function map(black, white, interval, spX, spY){
    return {map: [black, white], swapInterval: interval, spawnX: spX, spawnY: spY}
}

let currentLevelIdx = 0;
let currentFullLevel;
function swapMap(goingTo){
    currentFullLevel = goingTo.map
    level = currentFullLevel[0]
    player.spawnX = goingTo.spawnX
    player.spawnY = goingTo.spawnY
    player.x = player.spawnX
    player.y = player.spawnY
    player.hs = 0
    player.fs = 0

    tickImageState = 0
    lightState = 0
    lightTimer = 0
    lightTimerChangeInterval = goingTo.swapInterval
}