var frame = 0;
var ttr = [];

var w = 28;
var h = 24;
var s = 64;
for(var i = 0; i < w; ++i){
    ttr.push([]);
    for(var j = 0; j < h; ++j){
        ttr[i].push(0);
    }
}
var playing = false;
var inbetween = 10;
var f = 0;
var cols = [
    color(255, 255, 255),
    color(138, 62, 0),
    color(0, 255, 255),
    color(255, 219, 172),
    color(94, 71, 64),
    color(45, 71, 102),
    color(0, 132, 255),
    color(153, 74, 50),
    color(45, 71, 102),
    color(153, 74, 50),
    color(153, 74, 50),
    color(153, 74, 50),
    color(153, 74, 50),
    color(153, 74, 50),
    color(153, 74, 50),
    color(153, 74, 50),
];
var curClr = 1;
var camSpeed = 4;
draw = function() {
    if(pressing["w"]){
        transY += camSpeed;
    }
    if(pressing["a"]){
        transX += camSpeed;
    }
    if(pressing["s"]){
        transY -= camSpeed;
    }
    if(pressing["d"]){
        transX -= camSpeed;
    }
    if(inputStart["ArrowRight"]){
        ++w;
        ttr.push([]);
        for(var i = 0; i < ttr[i].length; ++i){
            ttr[ttr.length - 1].push(0)
        }
    }
    if(inputStart["ArrowDown"]){
        ++h;
        for(var i = 0; i < ttr.length; ++i){
            ttr[i].push(0);
        }
    }
    if(inputStart["ArrowLeft"]){
        --w;
        ttr.splice(ttr.length-1, 1)
    }
    if(inputStart["ArrowUp"]){
        --h;
        for(var i = 0; i < ttr[0].length; ++i){
            ttr[i].splice(ttr[i].length-1, 1)
        }
    }
    background(0, 0, 0);
    for(var i = 0; i < w; ++i){
        for(var j = 0; j < h; ++j){
            noStroke();
            fill(cols[ttr[i][j]]);
            rect(i * (width/s), j * (width/s), (width/s), width/s);
        }
    }

    if(mouseDown){
        if(floor((mouseX-transX) / (width / s)) >= 0 && floor((mouseY-transY) / (width / s)) >= 0 && floor((mouseX-transX) / (width / s)) < w && floor((mouseY-transY) / (width / s)) < h){
            if(mouseButton === 0){
                ttr[floor((mouseX-transX) / (width / s))][floor((mouseY-transY) / (width / s))] = curClr;
            }
            if(mouseButton === 2){
                ttr[floor((mouseX-transX) / (width / s))][floor((mouseY-transY) / (width / s))] = 0;
            }
        }
    }
};

keyPressed = function(){
    
    if(keyCode >= 48 && keyCode <= 57){
        curClr = keyCode - 48;
    }
    if(key.toString() === "p"){
        f = 0;
        playing = !playing;
    }
    if(keyCode === 32){
        var str = "var arrName = [";
        for(var i = 0; i < w; ++i){
            str += "[" + ttr[i] + "],"
        }
        str += "];"
        println(str);
    }
};