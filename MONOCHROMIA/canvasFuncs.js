var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var FRAMERATE = 100

canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.position = "absolute"
canvas.style.top = "0px";
canvas.style.left = "0px";

let defaultWidth = 1366
let defaultHeight = 768
var width = canvas.width
var height = canvas.height

var canvasMap = ctx.getImageData(0, 0, width, defaultHeight);

function getPixelData(x, y){
	var rIndex = getCoords(x, y);
	var data = canvasMap.data;
	return {r: data[rIndex], g: data[rIndex + 1], b: data[rIndex + 2], a: data[rIndex + 3]};
}
function getCoords(x, y){
	var rIndex = y * (width * 4) + x * 4;
	return rIndex;
}

function getPixelHex(x, y){
	var pixel = getPixelData(x, y);
	return color(pixel.r, pixel.g, pixel.b);
}
function setPixelHex(x, y, clr){
	var pixelIndex = getCoords(x, y);
	var colorRGB = hexToRGB(clr);
	return color(colorRGB.r, colorRGB.g, colorRGB.b);
}
let pMouseX = 0;
let pMouseY = 0;
var mouseX = 0
var mouseY = 0

var transX = 0;
var transY = 0;
let scaleValue = 1;

function scale(){
	scaleValue = width/defaultWidth
}

function linesTouching(a,b,c,d,p,q,r,s) {
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

function translate(xTrans, yTrans){
	transX = xTrans
	transY = yTrans
}

function average(){
	var args = arguments;
	if(typeof args[0] !== "number"){args = args[0]}
	var num = 0;
	for(var i = 0; i < args.length; ++i){
		num += args[i];
	}
	return num / args.length;
}

function hexToRGB(hexStr){
	var r = hexStr.slice(1, 3);
	var g = hexStr.slice(3, 5);
	var b = hexStr.slice(5, 7);
	return {
		red: r,
		green: g,
		blue: b
	};
}

class colorObj {

	set r(value){
		this.rChannel = max(0, min(255, value));
		var rStr = this.rChannel.toString(16);
		var gStr = this.gChannel.toString(16);
		var bStr = this.bChannel.toString(16);
		if (rStr.length === 1) { rStr = "0" + rStr; }
		if (gStr.length === 1) { gStr = "0" + gStr; }
		if (bStr.length === 1) { bStr = "0" + bStr; }
		var clr = "#" + rStr + gStr + bStr;
		this.rChannel = this.rChannel;
		this.gChannel = this.gChannel;
		this.bChannel = this.bChannel;
		this.color = clr;
	}
	set g(value){
		this.gChannel = max(0, min(255, value));
		var rStr = this.rChannel.toString(16);
		var gStr = this.gChannel.toString(16);
		var bStr = this.bChannel.toString(16);
		if (rStr.length === 1) { rStr = "0" + rStr; }
		if (gStr.length === 1) { gStr = "0" + gStr; }
		if (bStr.length === 1) { bStr = "0" + bStr; }
		var clr = "#" + rStr + gStr + bStr;
		this.rChannel = this.rChannel;
		this.gChannel = this.gChannel;
		this.bChannel = this.bChannel;
		this.color = clr;
	}
	set b(value){
		this.bChannel = max(0, min(255, value));
		var rStr = this.rChannel.toString(16);
		var gStr = this.gChannel.toString(16);
		var bStr = this.bChannel.toString(16);
		if (rStr.length === 1) { rStr = "0" + rStr; }
		if (gStr.length === 1) { gStr = "0" + gStr; }
		if (bStr.length === 1) { bStr = "0" + bStr; }
		var clr = "#" + rStr + gStr + bStr;
		this.rChannel = this.rChannel;
		this.gChannel = this.gChannel;
		this.bChannel = this.bChannel;
		this.color = clr;
	}

	get r(){return this.rChannel;}
	get g(){return this.gChannel;}
	get b(){return this.bChannel;}

	constructor(r, g, b) {
		if(!(r < 0 && g === 0 && b === 0)){
			var rStr = r.toString(16);
			var gStr = g.toString(16);
			var bStr = b.toString(16);
			if (rStr.length === 1) { rStr = "0" + rStr; }
			if (gStr.length === 1) { gStr = "0" + gStr; }
			if (bStr.length === 1) { bStr = "0" + bStr; }
			var clr = "#" + rStr + gStr + bStr;
			this.rChannel = r;
			this.gChannel = g;
			this.bChannel = b;
			this.color = clr;
		} else {
			var hexColor = pColorToHex(r);
			var rgbColor = hexToRGB(hexColor);
			this.rChannel = rgbColor.red;
			this.gChannel = rgbColor.green;
			this.bChannel = rgbColor.blue;
			this.color = hexColor;
		}
	}
}
function img(src, xOffset=0, yOffset=0){
	this.ready = true;
	this.img = new Image();
	this.img.src = src;
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	
	this.draw = function(x, y, scaleX=1, scaleY= scaleX === undefined ? 1 : scaleX, flipX, flipY){
		if(this.ready){
			x += this.xOffset + transX;
			y += this.yOffset + transY;
			if(flipX){
				ctx.scale(-1, 1)
				x *= -1;
				x -= this.img.width * scaleX;
			}
			if(flipY){
				ctx.scale(1, -1)
				y *= -1;
				y -= this.img.height * scaleY;
			}
			ctx.drawImage(this.img, x*scaleValue, y*scaleValue, this.img.width*scaleX*scaleValue, this.img.height*scaleY*scaleValue);
			if(flipX){
				ctx.scale(-1, 1)
			}
			if(flipY){
				ctx.scale(1, -1)
			}
		}
	};
}
function tileset(src, xOffset=0, yOffset=0){
	this.ready = true;
	this.img = new Image();
	this.img.src = src;
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	
	this.draw = function(x, y, scaleX=1, scaleY= scaleX === undefined ? 1 : scaleX, flipX, flipY, tile=0){
		if(this.ready){
			x += this.xOffset + transX;
			y += this.yOffset + transY;
			if(flipX){
				ctx.scale(-1, 1)
				x *= -1;
				x -= this.img.width * scaleX;
			}
			if(flipY){
				ctx.scale(1, -1)
				y *= -1;
				y -= this.img.height * scaleY;
			}
			ctx.drawImage(this.img, this.img.height * tile * scaleValue, 0, this.img.height, this.img.height, x, y, this.img.height*scaleX*scaleValue, this.img.height*scaleY*scaleValue);
			if(flipX){
				ctx.scale(-1, 1)
			}
			if(flipY){
				ctx.scale(1, -1)
			}
		}
	};
}
function color(r, g, b){
	if(r === null || g === null || b === null){
		return "#000000";
	}
	var rStr = r.toString(16);
	var gStr = g.toString(16);
	var bStr = b.toString(16);

	if(rStr.length === 1){rStr = "0" + rStr;}
	if(gStr.length === 1){gStr = "0" + gStr;}
	if(bStr.length === 1){bStr = "0" + bStr;}
	var clr = "#" + rStr + gStr + bStr;
	return clr;
}
// Functions
var touching = function(x, y, w, h, test_x, test_y, test_w, test_h){
	if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
	if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
	return test_x + test_w > x /*Left*/ && test_x < x + w /*Right*/ && test_y + test_h > y /*Top*/ && test_y < y + h /*Bottom*/;
};

function PVector(x, y){
	this.x = x;
	this.y = y;
	this.add = function(otherV){this.x += otherV.x; this.y += otherV.y;};
	this.sub = function(otherV){this.x -= otherV.x; this.y -= otherV.y;};
	this.mult = function(otherV){this.x *= otherV.x; this.y *= otherV.y;};
	this.div = function(otherV){this.x /= otherV.x; this.y /= otherV.y;};
}

function dist(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function pow(base, exp){
	return Math.pow(base, exp);
}

function sqrt(num){
	return Math.sqrt(num);
}

function sq(num){
	return num*num;
}

function lerp(a, b, alpha){
	return a + (b-a)*alpha;
}

function framerate(setTo){
	FRAMERATE = setTo;
}

function println(value){
	console.log(value);
}

function pColorToHex(pColor){
	var processingColor = pColor;
    processingColor += 16777216;
    var redInP = floor(processingColor / 65536);
    var greenInP = floor((processingColor - (redInP * 65536)) / 256);
    var blueInP = floor((processingColor - (redInP * 65536) - greenInP * 256));

	return color(redInP, greenInP, blueInP);
}

function fill(clrOrR, g, b){
	if(clrOrR === null || g === null || b === null){ctx.fillStyle = "#FFFFFF"; return;}
	if(typeof clrOrR === "string"){ctx.fillStyle = clrOrR}
	if(typeof clrOrR === "number" && clrOrR >= 0 && clrOrR <= 255){ctx.fillStyle = color(clrOrR, g, b);}
	if(typeof clrOrR === "number" && clrOrR < 0 && g === 0){ctx.fillStyle = pColorToHex(clrOrR);}
	if(typeof clrOrR === "object"){ctx.fillStyle = clrOrR.color;}
}

function stroke(){}
function noStroke(){}
function strokeWeight(){}
function text(txt, x, y){writeText(txt, x, y);}

function blend(clr1, clr2){

	var clr;
	var rInt1;
	var gInt1
	var bInt1;
	var rInt2;
	var gInt2;
	var bInt2;

	// No straight up numbers, I dont care

	if(typeof clr1 === "string"){
		rInt1 = parseInt(clr1.slice(1, 3), 16)
		gInt1 = parseInt(clr1.slice(3, 5), 16)
		bInt1 = parseInt(clr1.slice(5, 7), 16)
	}
	if(typeof clr2 === "string"){
		rInt2 = parseInt(clr2.slice(1, 3), 16)
		gInt2 = parseInt(clr2.slice(3, 5), 16)
		bInt2 = parseInt(clr2.slice(5, 7), 16)
	}
	if(typeof clr1 === "object"){
		clr1 = JSON.parse(JSON.stringify(clr1));
		rInt1 = clr1.r
		gInt1 = clr1.g
		bInt1 = clr1.b
	}
	if(typeof clr2 === "object"){
		clr2 = JSON.parse(JSON.stringify(clr2));
		rInt2 = clr2.r
		gInt2 = clr2.g
		bInt2 = clr2.b
	}
	var r = average(rInt1, rInt2);
	var g = average(gInt1, gInt2);
	var b = average(bInt1, bInt2);
	clr = color(round(r), round(g), round(b));
	return clr;
}


function rect(x, y, w, h){
	ctx.fillRect((x + transX)*scaleValue, (y + transY)*scaleValue, w*scaleValue, h*scaleValue)
}

function ellipse(x, y, w, h){
	ctx.beginPath();
	ctx.arc(x + transX, y + transX, w, 0, 2 * Math.PI);
	ctx.fill();
}

function lineColor(setTo){
	ctx.strokeStyle = setTo;
}
function line(x1, y1, x2, y2){
	let theLine = new Path2D();
	theLine.moveTo(x1 + transX, y1 + transY);
	theLine.lineTo(x2 + transX, y2 + transY);
	theLine.closePath();
	ctx.stroke(theLine);
}
function font(setTo){
	ctx.font = setTo
}
function fontSize(setTo){
	var fontArgs = ctx.font.split(' ');
	var newSize = setTo;
	ctx.font = newSize + 'px ' + fontArgs[fontArgs.length - 1]; // using the last part
}
function writeText(txt, x, y){
	let fontArgs = ctx.font.split(' ');
	let currentSize = fontArgs[0].slice(0, fontArgs[0].length-2 )
	let newSize = (currentSize*scaleValue);
	ctx.font = newSize + 'px ' + fontArgs[fontArgs.length - 1]; // using the last part
	ctx.strokeText(txt, (x + transX)*scaleValue, (y + transY)*scaleValue)
	fontSize(currentSize)
}
function fillText(txt, x, y){
	let fontArgs = ctx.font.split(' ');
	let currentSize = fontArgs[0].slice(0, fontArgs[0].length-2)
	let newSize = (currentSize*scaleValue);
	ctx.font = newSize + 'px ' + fontArgs[fontArgs.length - 1]; // using the last part
	ctx.fillText(txt, (x + transX)*scaleValue, (y + transY)*scaleValue)
	fontSize(currentSize)
}

function background(color, g, b){
	if(typeof color === "string"){
		var oldClr = ctx.fillStyle;
		fill(color);
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		fill(oldClr);
	}
	if(typeof color === "number"){
		var oldClr = ctx.fillStyle;
		fill(color, g, b);
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		fill(oldClr);
	}
	if(typeof color === "object"){
		var oldClr = ctx.fillStyle;
		fill(color);
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		fill(oldClr);
	}
}
function floor(e){
	return Math.floor(e)
}
function ceil(e){
	return Math.ceil(e)
}
function round(num){
	return Math.round(num);
}
var rngSeed = 0;
function randomSeed(n){
	rngSeed = n;
}
function pushMatrix(){}
function popMatrix(){}
function randomSeeded(min, max){
	var numberGenerated = ((((rngSeed + 17) * 169) / 463) % (max - min)) + min;
	rngSeed += numberGenerated;
	return numberGenerated;
}
function random(min, max){
	return Math.random() * (max - min) + min;
}
function sin(angle){
	return Math.sin(angle * Math.PI/180);
}
function cos(angle){
	return Math.cos(angle * Math.PI/180);
}
function max(a, b){
	if(a < b){return b;}
	return a;
}
function min(a, b){
	if(a < b){return a;}
	return b;
}
function constrain(val, minVal, maxVal){
	return min(max(val, minVal), maxVal);
}
function abs(num){
	return Math.abs(num);
}
function quad(x1, y1, x2, y2, x3, y3, x4, y4){
	
	let region = new Path2D();
	region.moveTo(x1 + transX, y1 + transY);
	region.lineTo(x2 + transX, y2 + transY);
	region.lineTo(x3 + transX, y3 + transY);
	region.lineTo(x4 + transX, y4 + transY);
	region.closePath();

	// Fill path
	ctx.fill(region);
}

function touching(x, y, w, h, test_x, test_y, test_w, test_h){
	if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
	if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
	if(test_x + test_w > x /*Left*/ && test_x < x + w /*Right*/ && test_y + test_h > y /*Top*/ && test_y < y + h /*Bottom*/){
		return true;
	} else {
		return false;
	}
};

var pressing = {};
var keys = pressing;
var inputStart = {};
let mouseClickBegan = false;
var time = {
	timer: 0.001,
	timerOnLastFrame: 0.001,
	timeBetweenFrames: 0.001,
	trueFramerate: FRAMERATE,
	deltaTime: 1,
	ellapsedFrames: 0,
	timers: [],
};
//setInterval(function(){
//	time.timer += 0.005;
//}, 5)

draw = function(){};
keyDown = function(e){keyPressed(e);};
function keyPressed(e){}
keyUp = function(e){keyReleased(e);}
keyReleased = function(e){}
mouseClicked = function(){}
function mouseMoved(e){}
function drawFrame(){
	if(firstClick){
		draw();
		time.timer = Date.now()*0.001
		++time.ellapsedFrames;
		time.timeBetweenFrames = time.timer - time.timerOnLastFrame;
		time.trueFramerate = 1/time.timeBetweenFrames;
		time.deltaTime = FRAMERATE / time.trueFramerate;
		time.timerOnLastFrame = time.timer;
	} else {
		background("#000000");
		fontSize(200);
		fill("#FFFFFF")
		fillText("Click to start", 200, defaultHeight - 400);
		fillText("program", 400, defaultHeight - 200);
	}
	for(var i = 0; i < time.timers.length; ++i){
		--time.timers[i][1];
		if(time.timers[i][1] <= 0){
			time.timers[i][0]();
			time.timers.splice(i, 1)
			--i;
		}
	}
	inputStart = {};
	mouseClickBegan = false;
	pMouseX = mouseX;
	pMouseY = mouseY;
	setTimeout(drawFrame, 1000 / FRAMERATE)
}
drawFrame();
var keyCode = 0;
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;
var SHIFT = 16;
var key = "";
var mouseDown = false;
var mouseButton = 0;
document.onkeydown = function (e) {
	keyCode = e.keyCode;
	key = e.key;
	if(!pressing[key.toString()]){
		inputStart[key.toString()] = true;
		inputStart[keyCode] = true;
	}
	pressing[key.toString()] = true;
	pressing[keyCode] = true;
	
	keyDown(e.key.toString())
};
document.onkeyup = function (e) {
	pressing[e.key.toString()] = false;
	pressing[e.keyCode] = false;
	keyUp(e.key.toString())
};

document.onmousemove = function(event){
	pMouseX = mouseX;
	pMouseY = mouseY;
	mouseX = event.pageX / scaleValue
	mouseY = event.pageY / scaleValue
	mouseMoved(event);
}
var firstClick = false;
document.onmousedown = function(e){
	mouseClickBegan = true;
	mouseDown = true;
	mouseButton = e.button
	
	mouseClicked(e);
	if(!firstClick){
		background(255, 255, 255)
		fontSize(15);
		firstClick = true;
	}
}
document.onmouseup = function(){
	mouseDown = false;
}

window.addEventListener('contextmenu', function (e) { 
  e.preventDefault(); 
}, false);
