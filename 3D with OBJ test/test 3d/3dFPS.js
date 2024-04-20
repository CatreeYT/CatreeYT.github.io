var walkSpeed = 1;
var jumpPower = 10;
var camSensitivity = 0.25;
var camVerticalMax = 85;
var camVerticalMin = -85

canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock({
        unadjustedMovement: true,
    });
});
function mouseMoved(e){
	//mxChange = e.movementX;
    camRot.y += e.movementX * camSensitivity;
    camRot.x += e.movementY * camSensitivity;
	if(camRot.x > camVerticalMax){camRot.x = camVerticalMax;}
	if(camRot.x < camVerticalMin){camRot.x = camVerticalMin;}
}
function movePlayer(){
    if(pressing.w){camPos.z += cos(camRot.y) * walkSpeed; camPos.x += sin(camRot.y) * walkSpeed;}
    if(pressing.s){camPos.z -= cos(camRot.y) * walkSpeed; camPos.x -= sin(camRot.y) * walkSpeed;}
    if(pressing.a){camPos.z -= cos(camRot.y + 90) * walkSpeed; camPos.x -= sin(camRot.y + 90) * walkSpeed;}
    if(pressing.d){camPos.z += cos(camRot.y + 90) * walkSpeed; camPos.x += sin(camRot.y + 90) * walkSpeed;}
    if(pressing[LEFT]){camRot.y -= 2;}
    if(pressing[RIGHT]){camRot.y += 2;}
    if(pressing[UP]){camRot.x -= 2;}
    if(pressing[DOWN]){camRot.x += 2;}
}