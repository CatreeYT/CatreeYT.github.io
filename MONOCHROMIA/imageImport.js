function getImgBlackWhite(src, offX, offY){
    return [
        new img(src + "-BlackBG.png", offX, offY),
        new img(src + "-WhiteBG.png", offX, offY)
    ]
}
// UI
let tickImages = [];
for(let i = 0; i <= 3; ++i){
    tickImages.push(new img("Sprites/Swap Indicator/" + i + ".png", 0, 0))
}
let tickLight = [
    new img("Sprites/Swap Indicator/Purple 1.png", 0, 0),
    new img("Sprites/Swap Indicator/Blue 1.png", 0, 0)
]
let titleScreenPressZ = [
    new img("Sprites/Title Screen/PRESS.png", 0, 0),
    new img("Sprites/Title Screen/Z.png")
]

// Objects
let spikes = getImgBlackWhite("Sprites/Spikes/Spikes", 0, -22)
let doorwaySprite = new img("Sprites/Misc/Doorway.png", 0, 0)

// Player
let plrAnimDie = []
for(let i = 1; i <= 6; ++i){
    plrAnimDie.push(getImgBlackWhite("Sprites/Player/Death/Player Explosion-"+i, -8, -6))
}

let facingLeftExtraMovement = -5

let plrAnimIdleRaw = [
    new img("Sprites/Player/Idle/Idle0.png", -7, -1),
    new img("Sprites/Player/Idle/Idle1.png", -7, -1),
    new img("Sprites/Player/Idle/Idle2.png", -7, -1),
]
let idleAnimSpeed = 0.05
let plrAnimIdle = [
    plrAnimIdleRaw[0],
    plrAnimIdleRaw[1],
    plrAnimIdleRaw[2],
    plrAnimIdleRaw[1],
]
let plrAnimWalkRaw = [
    new img("Sprites/Player/Walk/Walk1.png", -7, -1),
    new img("Sprites/Player/Walk/Walk2.png", -7, -1),
    new img("Sprites/Player/Walk/Walk5.png", -7, -1),
    new img("Sprites/Player/Walk/Walk6.png", -7, -1),
]
let walkAnimSpeed = 0.15
let plrAnimWalk = [
    plrAnimWalkRaw[0],
    plrAnimWalkRaw[1],
    plrAnimWalkRaw[0],
    plrAnimIdle[0],
    plrAnimWalkRaw[2],
    plrAnimWalkRaw[3],
    plrAnimWalkRaw[2],
    plrAnimIdle[0]
]
let plrAnimJump = new img("Sprites/Player/Air/Jump.png", -7, -1)
let plrAnimFall = new img("Sprites/Player/Air/Fall.png", -7, -1)