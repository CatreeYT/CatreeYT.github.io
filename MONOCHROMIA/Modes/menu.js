function runMainMenu(){
    runMainMenuExtraControls()
    fill(0, 0, 0)
    rect(0, 0, defaultWidth*0.5, defaultHeight)
    fill(255, 255, 255)
    rect(defaultWidth*0.5, 0, defaultWidth*0.5, defaultHeight)

    fontSize(60)
    fillText("MONOC", defaultWidth*0.5 - 235, defaultHeight*0.5 - 60)
    fill(0, 0, 0)
    fillText("HROMIA", defaultWidth*0.5 + 2, defaultHeight*0.5 - 60)

    titleScreenPressZ[0].draw(defaultWidth*0.5 - 200, defaultHeight*0.5 + 80, 4, 4, 0, 0)
    titleScreenPressZ[1].draw(defaultWidth*0.5 + 60, defaultHeight*0.5 + 80, 4, 4, 0, 0)
}

function runMainMenuExtraControls(){
    if(inputStart["z"]){
        currentMode = 0
    }
}

let transitionData = {
    y: 0,
    transitioning: false
}
function runTransition(){
    if(transitionData.transitioning){
        fill(colorWvB[1-lightState])
        rect(0, transitionData.y - defaultHeight, defaultWidth, defaultHeight)
    }
}