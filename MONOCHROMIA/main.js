swapMap(maps[0])

function extraControls(){
    switch(currentMode){
        case 0: {
            gameplayExtraControls()
            break;
        }
        /*
        case 1: {
            mapEditExtraControls()
            break;
        }
        */
    }
}

function draw(){
    try {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        width = canvas.width;
        height = canvas.height;
        ctx.imageSmoothingEnabled = false;
        switch(currentMode){
            case 0: {
                runGameplay()
                break;
            }
            case 1: {
                runMapEdit()
                break;
            }
            case 2: {
                runMainMenu()
                break;
            }
        }

    } catch (e){
        fontSize(10)
        fillText(e.stack, 10, 100)
    }
}