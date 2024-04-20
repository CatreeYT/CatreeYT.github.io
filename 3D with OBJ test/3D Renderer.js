function lerp(a, b, alpha){
    return a + alpha * (b-a);
}
function strokeWeight(){}

var pressing = {};

var cam;
var numDiv = 500;
var ORIGIN;
function vector3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.add = function(otherVect3){
        this.x += otherVect3.x;
        this.y += otherVect3.y;
        this.z += otherVect3.z;
    };
    this.sub = function(otherVect3){
        this.x -= otherVect3.x;
        this.y -= otherVect3.y;
        this.z -= otherVect3.z;
    };
    this.mult = function(otherVect3){
        this.x *= otherVect3.x;
        this.y *= otherVect3.y;
        this.z *= otherVect3.z;
    };
    this.div = function(otherVect3){
        this.x /= otherVect3.x;
        this.y /= otherVect3.y;
        this.z /= otherVect3.z;
    };
    this.dist = function(otherVect3){
        var horizontalDist = dist(this.x, this.z, otherVect3.x, otherVect3.z);
        var verticalDist = dist(horizontalDist, 0, 0, otherVect3.y);
        return verticalDist;
    };
    this.orbit = function(object, rotX, rotY, rotZ){
        var a = new vector3(this.x - object.x, this.y - object.y, this.z - object.z);
        var sinTheta = sin(rotX);
        var cosTheta = cos(rotX);
        var x = a.x;
        var y = a.y;
        var z = a.z;
        a.y = y * cosTheta - z * sinTheta;
        a.z = z * cosTheta + y * sinTheta;
        var sinTheta = sin(rotY);
        var cosTheta = cos(rotY);
        var x = a.x;
        var y = a.y;
        var z = a.z;
        a.x = x * cosTheta - z * sinTheta;
        a.z = z * cosTheta + x * sinTheta;
        var sinTheta = sin(rotZ);
        var cosTheta = cos(rotZ);
        var x = a.x;
        var y = a.y;
        var z = a.z;
        a.x = x * cosTheta - y * sinTheta;
        a.y = y * cosTheta + x * sinTheta;
        this.x = a.x + object.x;
        this.y = a.y + object.y;
        this.z = a.z + object.z;
    };
    this.getDrawPoint = function(){
        var a = new vector3(this.x, this.y, this.z); // So it doesn't overwrite current position in the future
        // Important Math to draw 3D
        return new PVector((a.x / a.z) * numDiv, (a.y / a.z) * numDiv);
    };
}
ORIGIN = new vector3(0, 0, 0);
function cFrame(x, y, z, rotX, rotY, rotZ){
    this.position = new vector3(x, y, z);
    this.rotation = new vector3(rotX, rotY, rotZ);
}

function renderModel(x, y, z, rotX, rotY, rotZ, model){
    var pos = new vector3(x, y, z)
    pos.sub(cam.position);
    for(var i = 0; i < model.length; ++i){
        
        model[i].data.add(pos);
        model[i].data.orbit(pos, rotX, rotY, rotZ);
        model[i].data.orbit(ORIGIN, cam.rotation.x, cam.rotation.y, cam.rotation.z);
        if(model[i].data.z < 1){return;}
    }
    for(var i = 0; i < model.length; ++i){
        rect(model[i].data.getDrawPoint().x - 7, model[i].data.getDrawPoint().y - 7, 14, 14);
    }
};

cam = new cFrame(0, 0, 0, 0, 0, 0);

var camUpAngle = 0;

    function touching(x, y, w, h, test_x, test_y, test_w, test_h){
        if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
        if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
        if(test_x + test_w > x /*Left*/ && test_x < x + w /*Right*/ && test_y + test_h > y /*Top*/ && test_y < y + h /*Bottom*/){
            return true;
        } else {
        return false;
    }
    }
    
    var textureScale = {
        x: 1,
        y: 1
    };
    
    function lerp2d(v1, v2, alpha){
        return new PVector(lerp(v1.x, v2.x, alpha), lerp(v1.y, v2.y, alpha));
    }
    
    function quadP(p1, p2, p3, p4){
        quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    }
    function pointP(p){
        point(p.x, p.y);
    }
    
    function renderTexture(p1, p2, p3, p4, imgArr){
        if(typeof imgArr[0][0] === 'number'){
            ttrToHexttr(imgArr);
        }
        for(var i = 0; i < imgArr.length; ++i){
            for(var j = 0; j < imgArr[i].length; ++j){
                var p1p2 = lerp2d(p1, p2, (i)/imgArr.length);
                var p3p4 = lerp2d(p4, p3, (i)/imgArr.length);
                var p1p2Next = lerp2d(p1, p2, (i+1)/imgArr.length);
                var p3p4Next = lerp2d(p4, p3, (i+1)/imgArr.length);
                
                var cPosA = lerp2d(p1p2, p3p4, (j)/imgArr[i].length);
                var cPosB = lerp2d(p1p2, p3p4, (j+1)/imgArr[i].length);
                var nPosA = lerp2d(p1p2Next, p3p4Next, (j)/imgArr[i].length);
                var nPosB = lerp2d(p1p2Next, p3p4Next, (j+1)/imgArr[i].length);
                
                fill(imgArr[i][j]);
                strokeWeight(1);
                stroke(imgArr[i][j]);
                quadP(cPosA, nPosA, nPosB, cPosB);
            }
        }
        noStroke();
    }
    
    function ttrToHexttr(ttr){
        for(var i = 0; i < ttr.length; ++i){
            for(var j = 0; j < ttr[i].length; ++j){
                ttr[i][j] = pColorToHex(ttr[i][j]);
            }
        }
        return ttr;
    }

    function average(){
        var args = arguments;
        var num = 0;
        for(var i = 0; i < args.length; ++i){
            num += args[i];
        }
        return num/args.length;
    }
    
    var cam;
    var numDiv = 500;
    var ORIGIN;
    
    var drawFaces = [];
    
    function faceObj(p1, p2, p3, p4, clr, zAvg){
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.drawColor = clr;
        this.zAvg = zAvg;
        this.draw = function() {
            translate(width/2, height/2);
            renderTexture(this.p1, this.p2, this.p3, this.p4, clr);
        };
    }
    function renderFrame(){
        drawFaces.sort(function(a, b){return b.zAvg-a.zAvg;});
        for(var i = 0; i < drawFaces.length; ++i){
            drawFaces[i].draw();
        }
        drawFaces = [];
    }
    
    function vector3(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.add = function(otherVect3){
            this.x += otherVect3.x;
            this.y += otherVect3.y;
            this.z += otherVect3.z;
        };
        this.sub = function(otherVect3){
            this.x -= otherVect3.x;
            this.y -= otherVect3.y;
            this.z -= otherVect3.z;
        };
        this.mult = function(otherVect3){
            this.x *= otherVect3.x;
            this.y *= otherVect3.y;
            this.z *= otherVect3.z;
        };
        this.div = function(otherVect3){
            this.x /= otherVect3.x;
            this.y /= otherVect3.y;
            this.z /= otherVect3.z;
        };
        this.dist = function(otherVect3){
            var horizontalDist = dist(this.x, this.z, otherVect3.x, otherVect3.z);
            var verticalDist = dist(horizontalDist, 0, 0, otherVect3.y);
            return verticalDist;
        };
        this.orbit = function(object, rotX, rotY, rotZ){
            var a = new vector3(this.x - object.x, this.y - object.y, this.z - object.z);
            if(rotZ !== 0){
                var sinTheta = sin(rotZ);
                var cosTheta = cos(rotZ);
                var x = a.x;
                var y = a.y;
                var z = a.z;
                a.x = x * cosTheta - y * sinTheta;
                a.y = y * cosTheta + x * sinTheta;
            }
            if(rotX !== 0){
                var sinTheta = sin(rotX);
                var cosTheta = cos(rotX);
                var x = a.x;
                var y = a.y;
                var z = a.z;
                a.y = y * cosTheta - z * sinTheta;
                a.z = z * cosTheta + y * sinTheta;
            }
            if(rotY !== 0){
                var sinTheta = sin(rotY);
                var cosTheta = cos(rotY);
                var x = a.x;
                var y = a.y;
                var z = a.z;
                a.x = x * cosTheta - z * sinTheta;
                a.z = z * cosTheta + x * sinTheta;
            }
            this.x = a.x + object.x;
            this.y = a.y + object.y;
            this.z = a.z + object.z;
        };
        this.getDrawPoint = function(){
            var a = new vector3(this.x, this.y, this.z); // So it doesn't overwrite current position in the future
            // Important Math to draw 3D
            return new PVector((a.x / a.z) * numDiv, (a.y / a.z) * numDiv);
        };
    }
    ORIGIN = new vector3(0, 0, 0);
    function cFrame(x, y, z, rotX, rotY, rotZ){
        this.position = new vector3(x, y, z);
        this.rotation = new vector3(rotX, rotY, rotZ);
    }
    function pushMatrix(){}
    function popMatrix(){}
    function drawCube(x, y, z, l, w, h, rotX, rotY, rotZ, ttrs){
        var cube = {
        x: x - cam.position.x,
        y: y - cam.position.y,
        z: z - cam.position.z,
        length: l,
        width: w,
        height: h,
        };
        var pointsOG = [
            new vector3(-cube.length, -cube.height, -cube.width),
            new vector3(cube.length, -cube.height, -cube.width),
            new vector3(-cube.length, cube.height, -cube.width),
            new vector3(cube.length, cube.height, -cube.width),
            new vector3(-cube.length, -cube.height, cube.width),
            new vector3(cube.length, -cube.height, cube.width),
            new vector3(-cube.length, cube.height, cube.width),
            new vector3(cube.length, cube.height, cube.width),
        ];
        var points = [
            new vector3(cube.x + pointsOG[0].x, cube.y + pointsOG[0].y, cube.z + pointsOG[0].z),
            new vector3(cube.x + pointsOG[1].x, cube.y + pointsOG[1].y, cube.z + pointsOG[1].z),
            new vector3(cube.x + pointsOG[2].x, cube.y + pointsOG[2].y, cube.z + pointsOG[2].z),
            new vector3(cube.x + pointsOG[3].x, cube.y + pointsOG[3].y, cube.z + pointsOG[3].z),
            new vector3(cube.x + pointsOG[4].x, cube.y + pointsOG[4].y, cube.z + pointsOG[4].z),
            new vector3(cube.x + pointsOG[5].x, cube.y + pointsOG[5].y, cube.z + pointsOG[5].z),
            new vector3(cube.x + pointsOG[6].x, cube.y + pointsOG[6].y, cube.z + pointsOG[6].z),
            new vector3(cube.x + pointsOG[7].x, cube.y + pointsOG[7].y, cube.z + pointsOG[7].z),
        ];
        for(var i = 0; i < points.length; ++i){
            points[i].orbit(cube, rotX, rotY, rotZ);
            points[i].orbit(ORIGIN, cam.rotation.x, cam.rotation.y, cam.rotation.z);
            if(points[i].z < 1){return;}
        }
        
        pushMatrix();
        translate(width/2, height/2);
        noStroke();
        
        drawFaces.push(new faceObj(points[1].getDrawPoint(), points[5].getDrawPoint(), points[7].getDrawPoint(), points[3].getDrawPoint(), ttrs[0], average(points[3].z, points[1].z, points[5].z, points[7].z)));
        drawFaces.push(new faceObj(points[1].getDrawPoint(), points[0].getDrawPoint(), points[2].getDrawPoint(), points[3].getDrawPoint(), ttrs[1], average(points[0].z, points[2].z, points[3].z, points[1].z)));
        drawFaces.push(new faceObj(points[4].getDrawPoint(), points[5].getDrawPoint(), points[7].getDrawPoint(), points[6].getDrawPoint(), ttrs[2], average(points[6].z, points[4].z, points[5].z, points[7].z)));
        drawFaces.push(new faceObj(points[7].getDrawPoint(), points[6].getDrawPoint(), points[2].getDrawPoint(), points[3].getDrawPoint(), ttrs[3], average(points[7].z, points[6].z, points[2].z, points[3].z)));
        drawFaces.push(new faceObj(points[5].getDrawPoint(), points[4].getDrawPoint(), points[0].getDrawPoint(), points[1].getDrawPoint(), ttrs[4], average(points[5].z, points[4].z, points[0].z, points[1].z)));
        drawFaces.push(new faceObj(points[4].getDrawPoint(), points[0].getDrawPoint(), points[2].getDrawPoint(), points[6].getDrawPoint(), ttrs[5], average(points[4].z, points[0].z, points[2].z, points[6].z)));
        popMatrix();
    }
    function cubeCF(cf, size, clr){
        drawCube(cf.position.x, cf.position.y, cf.position.z, size.x, size.y, size.z, cf.rotation.x, cf.rotation.y, cf.rotation.z, clr);
    }
    
    cam = new cFrame(0, 0, 0, 0, 0, 0);
    
    var test = new cFrame(0, 0, 150, 0, 0, 0);
    var test2= new vector3(10, 10, 10);
    var camUpAngle = 0;