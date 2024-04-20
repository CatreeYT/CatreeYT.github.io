function average(numbers){
    if(numbers.length !== 0){
        var addedNums = 0;
        for(var i = 0; i < numbers.length; ++i){
            addedNums += numbers[i];
        }
        return addedNums / numbers.length;
    } else {
        return 0;
    }
}

function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}

function shapeWithCollision(x, y, lines){
    this.x = x;
    this.y = y;
    this.lines = lines;
    this.draw = function() {
        for(var i = 0; i < lines.length; ++i){
        if(i !== lines.length - 1){
            line(this.lines[i].x + this.x, this.lines[i].y + this.y, this.lines[i + 1].x + this.x, this.lines[i + 1].y + this.y);
        } else {
            line(this.lines[i].x + this.x, this.lines[i].y + this.y, lines[0].x + this.x, lines[0].y + this.y);
        }
    }
    };
    
    this.intersectsWith = function(otherShape){
        for(var i = 0; i < this.lines.length; ++i){
            var curLine = {
                s: new PVector(this.lines[i].x + this.x, this.lines[i].y + this.y),
                e: null
            };
            if(i === this.lines.length - 1){
                curLine.e = new PVector(this.lines[0].x + this.x, this.lines[0].y + this.y);
            } else {
                curLine.e = new PVector(this.lines[i+1].x + this.x, this.lines[i+1].y + this.y);
            }
            
            for(var j = 0; j < otherShape.lines.length; ++j){
                var otherLine = {
                    s: new PVector(otherShape.lines[j].x + otherShape.x, otherShape.lines[j].y + otherShape.y),
                    e: null
                };
                
                if(j === otherShape.lines.length - 1){
                    otherLine.e = new PVector(otherShape.lines[0].x + otherShape.x, otherShape.lines[0].y + otherShape.y);
                } else {
                    otherLine.e = new PVector(otherShape.lines[j+1].x + otherShape.x, otherShape.lines[j+1].y + otherShape.y);
                }
                if(intersects(curLine.s.x, curLine.s.y, curLine.e.x, curLine.e.y, otherLine.s.x, otherLine.s.y, otherLine.e.x, otherLine.e.y)){return true;}
            }
        }
        return false;
    };
    
}

var plr = new shapeWithCollision(202, 134, [new PVector(0, 0), new PVector(20, 0), new PVector(20, 20), new PVector(0, 20)]);

var fs = 0;
var cJ = false;

function ground(x, y, lines){
    var thisShape = new shapeWithCollision(x, y, lines);
    if(thisShape.intersectsWith(plr)){
        plr.y -= 0.5;
        cJ = true;
        fs = 0;
    }
}

var walls = [];

var drawCasts = 1;

function raycast(x, y, ang, maxDist, precision){
    var ray = new shapeWithCollision(x, y, [new PVector(0, 0), new PVector(sin(ang) * maxDist, cos(ang) * maxDist)]);
    
    var p2check = new PVector(ray.lines[1].x, ray.lines[1].y);
    
    var testingRay = new shapeWithCollision(ray.x, ray.y, [new PVector(0, 0), p2check]);
    
    var touchingWall = false;
    for(var i = 0; i < walls.length; ++i){
        touchingWall = walls[i].intersectsWith(testingRay) ? true : touchingWall;
    }
    
    if(touchingWall){
        while(touchingWall){
            p2check.x = average([ray.lines[0].x, p2check.x]);
            p2check.y = average([ray.lines[0].y, p2check.y]);
            touchingWall = false;
            for(var i = 0; i < walls.length; ++i){
                touchingWall = walls[i].intersectsWith(testingRay) ? true : touchingWall;
            }
        } 
        while(!touchingWall){
            p2check.x += sin(ang) * precision;
            p2check.y += cos(ang) * precision;
            touchingWall = false;
            for(var i = 0; i < walls.length; ++i){
                touchingWall = walls[i].intersectsWith(testingRay) ? true : touchingWall;
            }
        }
    }
    if(drawCasts){
        testingRay.draw();
        point(p2check.x + ray.x, p2check.y + ray.y);
    }
    return p2check;
}

function Vector3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function average3D(vertices){
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;

    for(var i = 0; i < vertices.length; ++i){
        xSum += vertices[i].x;
        ySum += vertices[i].y;
        zSum += vertices[i].z;
    }
    let xAvg = xSum / vertices.length;
    let yAvg = ySum / vertices.length;
    let zAvg = zSum / vertices.length;

    return new Vector3(xAvg, yAvg, zAvg)
}

function dist3D(p1, p2){
    let d1 = dist(p1.x, p1.z, p2.x, p2.z);
    return dist(p2.x, p2.y, d1, p1.y);
}

var cube1 = new Vector3(0, 0, 26);

var camPosX = 0;
var camPosY = 0;
var camPosZ = 0;

var camAngleX = 0;
var camAngleY = 0;
var camAngleZ = 0;

var faces = [
	[5, 1, 3, 7],
	[4, 0, 1, 5],
	[0, 4, 6, 2],
	[2, 6, 7, 3],
	[2, 0, 1, 3],
	[6, 7, 5, 4],
];

var focusPoint = new Vector3(0, 0, -300);

var allFaces = [];

var camWidth = 6400;
var halfCamWidth = camWidth/2;
var borderWidth = 800;
var borderHeight = 800;

function draw3D(x, y, z, xAngle, yAngle, zAngle, vertices, faces){

    x += camPosX;
    y += camPosY;
    z += camPosZ;


    // Set Object Angle
	var sinTheta = sin(zAngle);
    var cosTheta = cos(zAngle);
    for (var n = 0; n < vertices.length; n++) {
       var node = vertices[n];
       var xN = node.x;
       var yN = node.y;
       node.x = xN * cosTheta - yN * sinTheta;
       node.y = yN * cosTheta + xN * sinTheta;
    }
	var sinTheta = sin(xAngle);
    var cosTheta = cos(xAngle);
    for (var n = 0; n < vertices.length; n++) {
       var node = vertices[n];
       var yN = node.y;
       var zN = node.z;
       node.y = yN * cosTheta - zN * sinTheta;
       node.z = zN * cosTheta + yN * sinTheta;
    }
	
	var sinTheta = sin(yAngle);
    var cosTheta = cos(yAngle);
    for (var n = 0; n < vertices.length; n++) {
       var node = vertices[n];
       var xN = node.x;
       var zN = node.z;
       node.x = xN * cosTheta + zN * sinTheta;
       node.z = zN * cosTheta - xN * sinTheta;
    }
    // Set Cam Angle
    var sinTheta = sin(camAngleZ);
    var cosTheta = cos(camAngleZ);
    for (var n = 0; n < vertices.length; n++) {
        var node = vertices[n];
        var xN = node.x;
        var yN = node.y;
        node.x = xN * cosTheta - yN * sinTheta;
        node.y = yN * cosTheta + xN * sinTheta;
    }
    let xTemp = x;
    let yTemp = y;
    let zTemp = z + 300;
    x = xTemp * cosTheta - yTemp * sinTheta;
    y = yTemp * cosTheta + xTemp * sinTheta;
	var sinTheta = sin(camAngleX);
    var cosTheta = cos(camAngleX);
    for (var n = 0; n < vertices.length; n++) {
       var node = vertices[n];
       var yN = node.y;
       var zN = node.z;
       node.y = yN * cosTheta - zN * sinTheta;
       node.z = zN * cosTheta + yN * sinTheta;
    }
    xTemp = x;
    yTemp = y;
    zTemp = z + 300;
    y = yTemp * cosTheta - zTemp * sinTheta;
    z = (zTemp * cosTheta + yTemp * sinTheta) - 300;
	
	var sinTheta = sin(camAngleY);
    var cosTheta = cos(camAngleY);
    for (var n = 0; n < vertices.length; n++) {
       var node = vertices[n];
       var xN = node.x;
       var zN = node.z;
       node.x = xN * cosTheta + zN * sinTheta;
       node.z = zN * cosTheta - xN * sinTheta;
    }
    xTemp = x;
    yTemp = y;
    zTemp = z + 300;
    x = xTemp * cosTheta + zTemp * sinTheta;
    z = (zTemp * cosTheta - xTemp * sinTheta) - 300;

	var vDrawPos = [];
	vertices.forEach(function(){
	vDrawPos.push(null);
	})
	
	for(var i = 0; i < vertices.length; ++i){
		vertices[i].x += x;
		vertices[i].y += y;
		vertices[i].z += z;
	}
	for(var verts = 0; verts < vertices.length; ++verts){
        walls = [
            new shapeWithCollision(0, 0, [new PVector(vertices[verts].z + (vertices[verts].z - focusPoint.z) * 100, 
            vertices[verts].y + (vertices[verts].y - focusPoint.y) * 100
            ), 
            new PVector(focusPoint.z, focusPoint.y)])
        ];
        var drY = raycast(0, halfCamWidth, 180, camWidth, 2);

        walls = [
                new shapeWithCollision(0, 0, [new PVector(vertices[verts].z + (vertices[verts].z - focusPoint.z) * 100,
                 vertices[verts].x + (vertices[verts].x - focusPoint.x) * 100
                 ), new PVector(focusPoint.z, focusPoint.x)])
            ];
            var drX = raycast(0, halfCamWidth, 180, camWidth, 2);
		vDrawPos[verts] = new PVector(drX.y, drY.y);
        if(vDrawPos[verts].x === -camWidth && vertices[verts].x + x > 0){vDrawPos[verts].x = 0}
        if(vDrawPos[verts].y === -camWidth && vertices[verts].y + y > 0){vDrawPos[verts].y = 0}
    }
    for(var i = 0; i < faces.length; ++i){
        let thisFace = [];
        for(var j = 0; j < faces[i].length; ++j){
            thisFace.push(vertices[faces[i][j]]);
        }
        for(var j = 0; j < faces[i].length; ++j){
            thisFace.push(vDrawPos[faces[i][j]]);
        }
        let faceActual = [];
        for(var j = 0; j < thisFace.length/2; ++j){
            faceActual.push(thisFace[j]);
        }
        thisFace.push(dist3D(average3D(faceActual.slice()), focusPoint))
        thisFace.push(ctx.fillStyle);
        allFaces.push(thisFace.slice());
    }
	
}

function drawCuboid(x, y, z, l, w, h, xAngle, yAngle, zAngle){
	draw3D(x, y, z, xAngle, yAngle, zAngle, [
        new Vector3(-l, -h, w), // 0
        new Vector3(l, -h, w), // 1
        new Vector3(-l, h, w), // 2
        new Vector3(l, h, w), // 3
        new Vector3(-l, -h, -w), // 4
        new Vector3(l, -h, -w), // 5
        new Vector3(-l, h, -w), // 6
        new Vector3(l, h, -w), // 7
    ], [
	[5, 1, 3, 7],
	[4, 0, 1, 5],
	[0, 4, 6, 2],
	[2, 6, 7, 3],
	[2, 0, 1, 3],
	[6, 7, 5, 4],
]);
}

function drawShapes(){
    allFaces.sort(function(a, b){
        return b[8] - a[8];
    })
    for(var i = 0; i < allFaces.length; ++i){
		let face = allFaces[i];
        fill(face[9])
		quad(face[4].x + halfCamWidth + 0.5 * borderWidth, face[4].y + halfCamWidth + 0.5 * borderHeight, face[5].x + halfCamWidth + 0.5 * borderWidth, face[5].y + halfCamWidth + 0.5 * borderHeight, face[6].x + halfCamWidth + 0.5 * borderWidth, face[6].y + halfCamWidth + 0.5 * borderHeight, face[7].x + halfCamWidth + 0.5 * borderWidth, face[7].y + halfCamWidth + 0.5 * borderHeight);
	}
    allFaces = [];
}

drawCasts = 0;