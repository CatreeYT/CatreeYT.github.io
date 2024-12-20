function runMainMenu(){
    runMainMenuExtraControls()
    fill(0, 0, 0)
    rect(0, 0, width*0.5, height)
    fill(255, 255, 255)
    rect(width*0.5, 0, width*0.5, height)

    fontSize(60)
    fillText("MONOC", width*0.5 - 235, height*0.5 - 60)
    fill(0, 0, 0)
    fillText("HROMIA", width*0.5 + 2, height*0.5 - 60)

    titleScreenPressZ[0].draw(width*0.5 - 200, height*0.5 + 80, 4, 4, 0, 0)
    titleScreenPressZ[1].draw(width*0.5 + 60, height*0.5 + 80, 4, 4, 0, 0)
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
        rect(0, transitionData.y - height, width, height)
    }
}