// Libraries: [
var pixels;
// [

// Both for 3D and rendering but only used in the latter so that's why it's here
function calcZ(p1, p2, p3, x, y) {
    var det = (p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y);

    var l1 = ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) / det;
    var l2 = ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) / det;
    var l3 = 1 - l1 - l2;

    return l1 * p1.z + l2 * p2.z + l3 * p3.z;
}

var pixels = [];
var zBuffer = [];
for(var i = 0; i < width; ++i){
    pixels.push([]);
    zBuffer.push([]);
    for(var j = 0; j < height; ++j){
        pixels[i].push(undefined);
        zBuffer[i].push(undefined);
    }
}

function renderTriangle(a, b, c, clr){
    if(a.z < 1 || b.z < 1 || c.z < 1){return;}
    function getX(p1, p2, y){
        if(p1.y !== p2.y){
        var slope = (p2.x - p1.x) / (p2.y - p1.y);
        var yInt = p1.x - p1.y * slope;
        return yInt + slope * y;
        }
        return undefined;
    }
    noStroke();
    var sides = [a, b, c];
    sides.sort(function(v1, v2){
        return v1.y - v2.y;
    });
    for(var i = constrain(min(min(a.y, b.y), c.y), 0, height); i <= constrain(max(max(a.y, b.y), c.y), 0, height); ++i){
        var x1 = getX(sides[0], sides[1], i);
        if(x1 === undefined){x1 = sides[0].x;}
        var x2 = getX(sides[0], sides[2], i);
        if(x2 === undefined){x2 = sides[0].x;}
        if(i >= sides[1].y){
            x1 = getX(sides[1], sides[2], i);
        }
        for(var j = constrain(min(x1, x2), 0, width); j <= constrain(max(x1, x2), 0, width); ++j){
            //if(i > 0 && i < height && j > 0 && j < height){
                var thisZ = floor(calcZ(a, b, c, j, i));
                if((thisZ <= zBuffer[floor(j)][floor(i)]|| zBuffer[floor(j)][floor(i)] === undefined)){
                    zBuffer[floor(j)][floor(i)] = thisZ;
                    pixels[floor(j)][floor(i)] = clr;
                }
            //}
        }
    }
}
var funColors = 0;
var fade = 0;
function renderLayer(pixels, layer){
    var screenWidth = pixels.length;
    var screenHeight = pixels[0].length;
    var pixelWidth = screenWidth / width;
    var pixelHeight = screenHeight / height;
    for(var j = 0; j < screenHeight; ++j){
        if(pixels[layer][j] !== undefined){
            if(funColors){
                fill(lerpColor(pixels[layer][j], color, 255/zBuffer[layer][j]));
            } else {
                if(fade){
                    var fadeDistance = 100;
                    if(zBuffer[layer][j] > fadeDistance){
                        var fadeAmount = (zBuffer[layer][j] - fadeDistance) / (255/2);
                        if(fadeAmount < 1){
                            fill(lerpColor(pixels[layer][j], color(0, 0, 0), fadeAmount));
                        } else {
                            fill(0, 0, 0);
                        }
                    } else {
                        fill(pixels[layer][j]);
                    }
                } else {
                    fill(pixels[layer][j]);
                }
            }
            //rect(layer * pixelWidth, j * pixelHeight, pixelWidth, pixelHeight);
            setPixel(layer, j, pixels[layer][j]);
        }
    }  
}

function renderScreen2(pixels){
    for(var i = 0; i < pixels.length; ++i){
        for(var j = 0; j < pixels[i].length; ++j){
            if(pixels[i][j] !== undefined){
                //fill(pixels[i][j]);
                //setPixel(i, j, pixels[i][j]);
                var index = (j*width+i)*4;
                canvasMap.data[index] = pixels[i][j].r;
                canvasMap.data[index+1] = pixels[i][j].g;
                canvasMap.data[index+2] = pixels[i][j].b;
                canvasMap.data[index+3] = 255;
            }
        }
    }
    commitPixels();
}

function renderScreen(pixels){
    for(var i = 0; i < width; ++i){
        renderLayer(pixels, i);
    }
    commitPixels();
}

function background2(r, g, b, pixels){
    background(r, g, b);
    for(var i = 0; i < pixels.length; ++i){
        for(var j = 0; j < pixels[i].length; ++j){
            pixels[i][j] = undefined;
            zBuffer[i][j] = undefined;
        }
    }
}
// ] Rendering
// [
var keys = {};

function getDrawPoint(p){
    var a = new PVector(p.x, p.y, p.z);
    if(a.z > 0){
        return new PVector((a.x / a.z) * (width / 2), (a.y / a.z) * (width / 2));
    } else {
        return null;
    }
}
function rotate3dCAM(Point, origin, rot){
    var a = new PVector(Point.x - origin.x, Point.y - origin.y, Point.z - origin.z);
        if(rot.y !== 0){
            var sinTheta = sin(rot.y);
            var cosTheta = cos(rot.y);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.x = x * cosTheta - z * sinTheta;
            a.z = z * cosTheta + x * sinTheta;
        }
        if(rot.x !== 0){
            var sinTheta = sin(rot.x);
            var cosTheta = cos(rot.x);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.y = y * cosTheta - z * sinTheta;
            a.z = z * cosTheta + y * sinTheta;
        }
        if(rot.z !== 0){
            var sinTheta = sin(rot.z);
            var cosTheta = cos(rot.z);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.x = x * cosTheta - y * sinTheta;
            a.y = y * cosTheta + x * sinTheta;
        }
        return a;
}
function rotate3d(Point, origin, rot){
    var a = new PVector(Point.x - origin.x, Point.y - origin.y, Point.z - origin.z);
        if(rot.y !== 0){
            var sinTheta = sin(rot.y);
            var cosTheta = cos(rot.y);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.x = x * cosTheta - z * sinTheta;
            a.z = z * cosTheta + x * sinTheta;
        }
        if(rot.x !== 0){
            var sinTheta = sin(rot.x);
            var cosTheta = cos(rot.x);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.y = y * cosTheta - z * sinTheta;
            a.z = z * cosTheta + y * sinTheta;
        }
        if(rot.z !== 0){
            var sinTheta = sin(rot.z);
            var cosTheta = cos(rot.z);
            var x = a.x;
            var y = a.y;
            var z = a.z;
            a.x = x * cosTheta - y * sinTheta;
            a.y = y * cosTheta + x * sinTheta;
        }
        
        a.add(origin);
        
        return a;
}

function triIsCW(a, b, c){
return ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) > 0;
}
var camPos = new PVector(-86, 2, 0);
var camRot = new PVector(26, 97, 0);

var tris = [];

function dist3d(a, b){
    return sqrt(sq(a.x - b.x) + sq(a.y - b.y) + sq(a.z - b.z));
}

function triObject(p1, p2, p3, clr, rot){
    // rot[0] is the center of the model/cube
    // rot[1] is the rotation vector
    
    var p1Rotated = rotate3d(p1, rot[0], rot[1]);
    var p2Rotated = rotate3d(p2, rot[0], rot[1]);
    var p3Rotated = rotate3d(p3, rot[0], rot[1]);
    
    p1Rotated = rotate3dCAM(p1Rotated, camPos, camRot);
    p2Rotated = rotate3dCAM(p2Rotated, camPos, camRot);
    p3Rotated = rotate3dCAM(p3Rotated, camPos, camRot);
    
    this.p1 = p1Rotated;
    this.p2 = p2Rotated;
    this.p3 = p3Rotated;
    this.drawPoints = [
        getDrawPoint(p1Rotated),
        getDrawPoint(p2Rotated),
        getDrawPoint(p3Rotated)
    ];
    if(this.drawPoints[0] !== null){
        this.drawPoints[0].add(new PVector(width/2, height/2, this.p1.z));
    }
    if(this.drawPoints[1] !== null){
        this.drawPoints[1].add(new PVector(width/2, height/2, this.p2.z));
    }
    if(this.drawPoints[2] !== null){
        this.drawPoints[2].add(new PVector(width/2, height/2, this.p3.z));
    }
    
    
    this.color = clr;
    this.draw = function() {
        if(this.drawPoints[0] && this.drawPoints[1] && this.drawPoints[2]){
            renderTriangle(this.drawPoints[0], this.drawPoints[1], this.drawPoints[2], clr);
        }
    };
}

function renderFrame(){
    for(var i = 0; i < tris.length; ++i){
        var t = tris[i];
        t.draw();
    }
}

function tri(p1, p2, p3, clr, rot){
    var t = new triObject(p1, p2, p3, clr, rot);
    tris.push(t);
}

function orbit(p, theta){
    var cosT = cos(theta);
    var sinT = sin(theta);
    return new PVector(p.x * cosT - p.y * sinT, 0, p.y * cosT + p.x * sinT);
}

function cube(cubePos, d, clr, rot){
    if(!rot){rot = new PVector(0, 0, 0);}
    var rotArr = [cubePos, rot];
    tri(
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z + d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z + d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z + d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z + d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z + d.z), 
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z - d.z), 
        new PVector(cubePos.x - d.x, cubePos.y - d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y - d.y, cubePos.z + d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z - d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
    tri(
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x - d.x, cubePos.y + d.y, cubePos.z + d.z), 
        new PVector(cubePos.x + d.x, cubePos.y + d.y, cubePos.z - d.z),
        clr,
        rotArr
    );
}

// ] 3D Stuff

// ]