var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var FRAMERATE = 100

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var width = canvas.width
var height = canvas.height

var mouseX
var mouseY

var transX = 0;
var transY = 0;

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
	if(typeof clrOrR === "string"){ctx.fillStyle = clrOrR; return;}
	if(typeof clrOrR === "number" && clrOrR >= 0){ctx.fillStyle = color(clrOrR, g, b); return;}
	if(typeof clrOrR === "number" && clrOrR < 0 && g === 0){ctx.fillStyle = pColorToHex(clrOrR); return;}
	if(typeof clrOrR === "object"){ctx.fillStyle = clrOrR.color; return;}
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
	ctx.fillRect(x + transX, y + transY, w, h)
}

function ellipse(x, y, w, h){
	ctx.beginPath();
	ctx.arc(x, y, w, 0, 2 * Math.PI);
	ctx.fill();
}

function lineColor(setTo){
	ctx.strokeStyle = setTo;
}
function line(x1, y1, x2, y2){
	let theLine = new Path2D();
	theLine.moveTo(x1, y1);
	theLine.lineTo(x2, y2);
	theLine.closePath();
	ctx.stroke(theLine);
}
function font(setTo){
	ctx.font = setTo
}
function fontSize(setTo){
	var fontArgs = ctx.font.split(' ');
	var newSize = setTo + 'px';
	ctx.font = newSize + ' ' + fontArgs[fontArgs.length - 1]; // using the last part
}
function writeText(txt, x, y){
	ctx.strokeText(txt, x, y)
}
function fillText(txt, x, y){
	ctx.fillText(txt, x, y)
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
function random(min, max){
	return Math.random() * (max - min)
}
function sin(angle){
	return Math.sin(angle * Math.PI/180);
}
function cos(angle){
	return Math.cos(angle * Math.PI/180);
}
function max(a, b){
	if(a > b){return a;}
	if(a < b){return b;}
	if(a === b){return a;}
}
function min(a, b){
	if(a < b){return a;}
	if(a > b){return b;}
	if(a === b){return a;}
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

var touching = function(x, y, w, h, test_x, test_y, test_w, test_h){
if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
if(test_x + test_w > x /*Left*/ && test_x < x + w /*Right*/ && test_y + test_h > y /*Top*/ && test_y < y + h /*Bottom*/){
return true;
} else {
return false;
}
};

var pressing = {
ArrowUp: false,
ArrowRight: false,
ArrowLeft: false,
ArrowDown: false,
Shift: false,
Tab: false,
a: false,
b: false,
c: false,
d: false,
e: false,
f: false,
g: false,
h: false,
i: false,
j: false,
k: false,
l: false,
m: false,
n: false,
o: false,
p: false,
q: false,
r: false,
s: false,
t: false,
u: false,
v: false,
w: false,
x: false,
y: false,
z: false,
};
var keys = pressing;
var inputStart = {
ArrowUp: false,
ArrowRight: false,
ArrowLeft: false,
ArrowDown: false,
Shift: false,
Tab: false,
a: false,
b: false,
c: false,
d: false,
e: false,
f: false,
g: false,
h: false,
i: false,
j: false,
k: false,
l: false,
m: false,
n: false,
o: false,
p: false,
q: false,
r: false,
s: false,
t: false,
u: false,
v: false,
w: false,
x: false,
y: false,
z: false,
};

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
	} else {
		background("#000000");
		fontSize(200);
		fill("#FFFFFF")
		fillText("Click to start", 200, height - 400);
		fillText("program", 400, height - 200);
	}
	inputStart = {
ArrowUp: false,
ArrowRight: false,
ArrowLeft: false,
ArrowDown: false,
Shift: false,
Tab: false,
a: false,
b: false,
c: false,
d: false,
e: false,
f: false,
g: false,
h: false,
i: false,
j: false,
k: false,
l: false,
m: false,
n: false,
o: false,
p: false,
q: false,
r: false,
s: false,
t: false,
u: false,
v: false,
w: false,
x: false,
y: false,
z: false,
};
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
var nouseDown = false;
document.onkeydown = function (e) {
	keyCode = e.keyCode;
	key = e.key;
	pressing[e.key.toString()] = true;
	pressing[e.keyCode] = true;
	inputStart[e.key.toString()] = true;
	keyDown(e.key.toString())
};
document.onkeyup = function (e) {
	pressing[e.key.toString()] = false;
	pressing[e.keyCode] = false;
	keyUp(e.key.toString())
};

document.onmousemove = function(event){
	mouseX = event.pageX
	mouseY = event.pageY
	mouseMoved(event);
}
var firstClick = false;
document.onmousedown = function(e){
	mouseDown = true;
	mouseClicked(e);
	firstClick = true;
}
document.onmouseup = function(){
	mouseDown = false;
}
window.addEventListener('contextmenu', function (e) { 
  e.preventDefault(); 
}, false);