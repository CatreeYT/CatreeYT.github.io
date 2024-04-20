            var canvas = document.getElementById("Canvas");
            var ctx = canvas.getContext("2d");
            
			var FRAMERATE = 100
			
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            
			var width = canvas.width
			var height = canvas.height
			
			var mouseX
			var mouseY
			
            // Functions
			var touching = function(x, y, w, h, test_x, test_y, test_w, test_h){
    if(test_w === undefined || test_w === null || test_w === 0){test_w = 1;}
    if(test_h === undefined || test_h === null || test_h === 0){test_h = 1;}
    return test_x + test_w > x /*Left*/ && test_x < x + w /*Right*/ && test_y + test_h > y /*Top*/ && test_y < y + h /*Bottom*/;
};

            function fill(color){
                ctx.fillStyle = color
            }
            function rect(x, y, w, h){
                ctx.fillRect(x, y, w, h)
            }
            function font(setTo){
                ctx.font = setTo
            }
            function writeText(txt, x, y){
                ctx.strokeText(txt, x, y)
            }
			
            function background(){
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
			function floor(e){
				return Math.floor(e)
			}
			function random(min, max){
				return Math.random() * (max - min)
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
			keyDown = function(e){};
			keyUp = function(e){}
			
            setInterval(function(){
                 draw()
            }, 1000 / FRAMERATE)
            
            document.onkeydown = function (e) {
                pressing[e.key.toString()] = true
				keyDown(e.key.toString())
            };
            document.onkeyup = function (e) {
                pressing[e.key.toString()] = false
				keyUp(e.key.toString())
            };
            
			document.onmousemove = function(event){
				mouseX = event.pageX - 7
				mouseY = event.pageY - 7
			}