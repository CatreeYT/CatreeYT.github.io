canvas.addEventListener("click", async () => {
	await canvas.requestPointerLock({
		unadjustedMovement: true,
	});
});

let upAngle = 0;

let playerSpeed = 2;

function mouseMoved(e){
	camAngleY -= e.movementX/10;
	upAngle += e.movementY/10;
}
let maxCamAngle = 80;
function runFrame(){
    if(upAngle > maxCamAngle){upAngle = maxCamAngle;}
    if(upAngle < -maxCamAngle){upAngle = -maxCamAngle;}

    camAngleX = upAngle * cos(camAngleY);
    camAngleZ = upAngle * sin(camAngleY);

    if(pressing.w){camPosZ -= sin(camAngleY + 90) * playerSpeed; camPosX -= cos(camAngleY + 90) * playerSpeed;}
	if(pressing.s){camPosZ += sin(camAngleY + 90) * playerSpeed; camPosX += cos(camAngleY + 90) * playerSpeed;}
	if(pressing.a){camPosZ += sin(camAngleY) * playerSpeed; camPosX += cos(camAngleY) * playerSpeed;}
	if(pressing.d){camPosZ -= sin(camAngleY) * playerSpeed; camPosX -= cos(camAngleY) * playerSpeed;}

    setTimeout(runFrame, 1000 / FRAMERATE)
}

runFrame();