function getImgBlackWhite(src, offX, offY){
    return [
        new img(src + "-BlackBG.png", offX, offY),
        new img(src + "-WhiteBG.png", offX, offY)
    ]
}

let tickImages = [];
for(let i = 0; i <= 3; ++i){
    tickImages.push(new img("Sprites/Swap Indicator/" + i + ".png", 0, 0))
}

let tickLight = [
    new img("Sprites/Swap Indicator/Purple 1.png", 0, 0),
    new img("Sprites/Swap Indicator/Blue 1.png", 0, 0)
]

let spikes = getImgBlackWhite("Sprites/Spikes/Spikes", 0, -22)
let doorwaySprite = new img("Sprites/Misc/Doorway.png", 0, 0)

let plrAnimDie = []
for(let i = 1; i <= 6; ++i){
    plrAnimDie.push(getImgBlackWhite("Sprites/Player/Death/Player Explosion-"+i, -8, -6))
}