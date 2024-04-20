camPos = new PVector(-53, 2, 150);
camRot = new PVector(0, 180, 0);

var frameCounter = 0;

framerate(60);

fill(68, 255, 0);
fill(255, 0, 0);
var cubePos = new PVector(-58, 11, 99);
var cube2Pos = new PVector(cubePos.x + 31, cubePos.y + 31, cubePos.z);
tris = [];

walkSpeed = 1.5;
jumpPower = 10;
var n = 0;
draw = function() {
    ++n;
    width = 640
    height = 480

    canvas.width = width
    canvas.height = height
    canvas.style.width = window.innerWidth + "px"
    canvas.style.height = window.innerHeight + "px"

    movePlayer()

    background2(0, 187, 255, pixels);

    cube(cubePos, new PVector(10, 10, 10), new colorObj(68, 255, 0), new PVector(0, n, 0));
    //cube(cube2Pos, new PVector(10, 10, 10), new colorObj(255, 0, 0), new PVector(0, 0, 0));

    renderFrame();
    tris = [];
    //}
    /*
    for(var i = 0; i < 400; ++i){
        ++frameCounter;
        if(frameCounter >= width){break;}
        if(frameCounter < height){
            renderLayer(pixels, frameCounter);
        }
    }
    */
    //frameCounter = 400;
    renderScreen2(pixels);
};