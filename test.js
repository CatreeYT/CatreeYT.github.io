var canDash = true;

function dashInit(){
	return new Promise(resolve => {
		resolve("resolved");
	}, 2000)
}

function moveCharacter(){
    console.log(arguments)
}

async function dash(){
    console.log("Begin Dash")
	var wait = await dashInit();
	var framesRem = 60;
	var dashLoop = function(){
		moveCharacter(framesRem);
		setTimeout(function(){
			--framesRem;
			if(framesRem > 0){
				dashLoop();
			} else {
				canDash = false;
			}
		}, 16)
	}
	dashLoop();
	framesRem = 600
	var allowDash = setInterval(function(){
		--framesRem;
		if(framesRem === 0){
			canDash = true;
			clearInterval(allowDash);
		}
	}, 16);
    dash();
    console.log("End Dash")
}
dash();
setInterval(function(){
	
}, 16);

document.addEventListener('keydown', function(e){
	if(e.key.toString() === "q"){
		dashInit();	
	}
});

