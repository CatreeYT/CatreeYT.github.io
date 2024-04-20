var nets = [];

var previousFramesRemembered = 10;
var aiInputsSize = 4+previousFramesRemembered*2; // Distance to right, distance to floor, floor type,... player falling velocity
var aiOutputSize = 2; // Left/Right, Jump
function sortingFunction(a, b){
    return b.playerData.x - a.playerData.x; // Greatest to least
}
var netsWidth = 8;
var netsHeight = 12;
var randomizedOnUpdate = 4;
var amountOfNetsTraining = 100;
var iterationsPerFrame = 50;

var GRAVITY = 0.05;
var SPEED = 2;
var JUMPFORCE = 2;
var WALKSENS = 100;
var JUMPSENS = 0;

function sum(array){
    var currentSum = 0;
    array.forEach(e => {currentSum += e;});
    return currentSum;
}

function node(nextLayerSize){
    this.weights = new Array(nextLayerSize).fill(random(-1, 1));
    this.bias = 0;
    this.value = 0;
    this.sendValueToNextLayer = function(nextLayer){
        for(var i = 0; i < nextLayer.length; ++i){
            nextLayer[i].value += this.value * this.weights[i] + this.bias;
        }
    }
    this.update = function(){
        for(var i = 0; i < this.weights.length; ++i){
            this.weights[i] += random(-0.05, 0.05)
        }
        this.bias += random(-0.005, 0.005)
    };
    this.copy = function(toCopy){
        for(var i = 0; i < this.weights.length; ++i){
            this.weights[i] = toCopy.weights[i]
        }
        this.bias = toCopy.bias;
    };
    this.reset = function(){
        for(var i = 0; i < this.weights.length; ++i){
            this.weights[i] = random(-1, 1);
        }
        this.bias = 0;
    };
}


function net(length, width){
    this.playerData = {
        x: 100,
        y: 100,
        fs: 0,
        alive: true,
        prevFloor: []
    };
    for(var i = 0; i < previousFramesRemembered; ++i){
        this.playerData.prevFloor.push({distance: 0, type: 0});
    }
    this.nodes = []; // new Array(length-1).fill(new Array(width).fill(new node(width)))
    for(var i = 0; i < length-1; ++i){
        this.nodes.push([])
        for(var j = 0; j < width; ++j){
            this.nodes[i].push(new node(width))
        }
    }
    this.outputs = [];
    for(var i = 0; i < aiOutputSize; ++i){this.outputs.push(new node(0))}
    //this.nodes.push(new Array(width).fill(new node(this.outputs.length)))
    this.nodes.push([]);
    for(var i = 0; i < width; ++i){
        this.nodes[this.nodes.length-1].push(new node(this.outputs.length))
    }
    this.inputs = [];
    for(var i = 0; i < aiInputsSize; ++i){this.inputs.push(new node(width))}
    for(var i = 0; i < this.inputs.length; ++i){
        this.inputs[i].value = round(Math.random());
    }
    this.copy = function(toCopy){
        for(var i = 0; i < length; ++i){
            for(var j = 0; j < width; ++j){
                this.nodes[i][j].copy(toCopy.nodes[i][j])
            }
        }
        for(var i = 0; i < this.inputs.length; ++i){
            this.inputs[i].copy(toCopy.inputs[i])
        }
    };
    this.update = function(){
        var randomGenerated = randomizedOnUpdate;
        var randomLayers = new Array(randomGenerated).fill(floor(random(-1, length)))
        var randomInside = new Array(randomGenerated).fill(floor(random(0, width)))

        for(var i = 0; i < randomGenerated; ++i){
            if(randomLayers[i] !== -1){
                this.nodes[randomLayers[i]][randomInside[i]].update()
            } else {
                this.inputs[floor(Math.random()*this.inputs.length)].update();
            }
        }
    };
    this.getValue = function(dontGetRandomInput){
        for(var i = 0; i < length; ++i){
            for(var j = 0; j < width; ++j){
                this.nodes[i][j].value = 0;
            }
        }
        for(var i = 0; i < this.outputs.length; ++i){
            this.outputs[i].value = 0;
        }
        if(!dontGetRandomInput){
            for(var i = 0; i < this.inputs.length; ++i){
                this.inputs[i].value = round(Math.random());
            }
        }
        for(var i = 0; i < this.inputs.length; ++i){
            this.inputs[i].sendValueToNextLayer(this.nodes[0])
        }
        for(var i = 0; i < length-1; ++i){
            for(var j = 0; j < width; ++j){
                this.nodes[i][j].sendValueToNextLayer(this.nodes[i+1])
            }
        }
        for(var j = 0; j < width; ++j){
            this.nodes[this.nodes.length-1][j].sendValueToNextLayer(this.outputs)
        }
    };
    this.reset = function(){
        this.copy = function(toCopy){
            for(var i = 0; i < length; ++i){
                for(var j = 0; j < width; ++j){
                    this.nodes[i][j].reset()
                }
            }
            for(var i = 0; i < this.inputs.length; ++i){
                this.inputs[i].reset()
            }
        };
    };
}

function xor(a, b){
    if(typeof a === "object"){
        return (1-a.value*b.value)*(a.value+b.value);
    }
    return (1-a*b)*(a+b);
}

nets = new Array(amountOfNetsTraining)
for(var i = 0; i < nets.length; ++i){
    nets[i] = new net(netsWidth, netsHeight);
}
var spX = 100;
var spY = 150;
function runGeneration(){
    nets.sort(function(a, b){return sortingFunction(a, b)})
    for(var i = 1; i < nets.length; ++i){
        nets[i].update();
    }
    //for(var i = 0; i < nets.length; ++i){
    //    nets[i].getValue();
    //}
    //nets.sort(function(a, b){return sortingFunction(a, b)})
    for(var i = 0; i < nets.length/2; ++i){
        nets[i+nets.length/2].copy(nets[i]);
    }
    for(var i = 0; i < nets.length; ++i){
        nets[i].playerData.alive = true;
        nets[i].playerData.x = spX;
        nets[i].playerData.y = spY;
        nets[i].playerData.fs = 0;
        nets[i].playerData.canJump = false;
        for(var j = 0; j < nets[i].playerData.prevFloor.length; ++j){
            nets[i].playerData.prevFloor[j].distance = 0;
            nets[i].playerData.prevFloor[j].type = 0;
        }
    }
}

function writeInfoToScreen(){
    fontSize(10)
    for(var i = 0; i < nets.length; ++i){
        fillText("(" + (i+1) + ") " + nets[i].outputs[0].value + ": " + nets[i].inputs[0].value + ", " + nets[i].inputs[1].value + " (off by " + (abs(nets[i].outputs[0].value) - xor(nets[i].inputs[0], nets[i].inputs[1])) + ")", 10, i*15 + 20)
    }
}

var valA = 0;
var valB = 0;

var generation = 0;
background(0, 0, 0)
function mouseClicked(){
    runGeneration();
}
var running = false;

var level = []
for(var i = 0; i < 40; ++i){
    level.push([])
    for(var j = 0; j < 20; ++j){
        level[i].push(0);
    }
}


function ground(x, y){
    level[x][y] = 1;
}
function dirt(x, y){
    level[x][y] = 3;
}
function death(x, y){
    level[x][y] = 2;
}
function group(x, y, w, h, type){
    for(var i = x; i < x+w; ++i){
        for(var j = y; j < y+h; ++j){
            type(i, j)
        }
    }
}
var levelToTrainOn = 0; // 0 is for testing levels
function setLevel(){
    for(var i = 0; i < level.length; ++i){
        for(var j = 0; j < level[i].length; ++j){
            level[i][j] = 0;
        }
    }
    switch (levelToTrainOn) {
        case 0:
            group(0, 12, 30, 1, ground);
            group(10, 11, 2, 1, death);
            group(14, 11, 2, 1, death);
            group(19, 11, 2, 1, death);
            group(27, 11, 2, 1, death);
        break;
        case 1:
            group(0, 12, 8, 1, ground);
            group(17, 12, 6, 1, ground);
            group(8, 11, 9, 2, dirt);
            group(8, 10, 9, 1, ground);
            death(10, 9);
            death(14, 9);
        break;
        case 2:
            group(0, 11, 10, 1, ground);
            group(15, 11, 8, 1, ground);
            group(12, 7, 1, 4, death);
            group(10, 13, 5, 1, ground);
            group(0, 12, 10, 2, dirt);
            group(15, 12, 5, 2, dirt);
        break;
        case 3:
            group(0, 11, 10, 1, ground);
            group(15, 11, 8, 1, ground);
            group(10, 11, 5, 2, death);
            group(10, 13, 5, 1, ground);
            group(0, 12, 10, 2, dirt);
            group(15, 12, 5, 2, dirt);
            ground(12, 10);
        break;
        case 4:
            group(0, 11, 11, 1, ground);
            ground(13, 11);
            ground(16, 10);
            ground(19, 9);
            ground(24, 11);
            group(28, 11, 9, 1, ground);
            group(39, 11, 1, 1, ground);
            group(37, 11, 2, 1, death);
            ground(32, 10);
            ground(33, 10);
            death(31, 10);
            death(34, 10);
        break;
        case 5:
            group(0, 11, 9, 1, ground);
            group(0, 12, 9, 3, dirt);
            ground(8, 10);
            ground(11, 9);
            group(14, 7, 4, 1, ground);
            ground(21, 7);
            group(25, 7, 4, 1, ground);
            group(32, 5, 1, 3, death);
            group(29, 12, 4, 1, ground);
            group(25, 8, 4, 5, dirt);
            ground(35, 13);
            group(38, 11, 2, 1, ground);
        break;
        case 6:
            group(0, 9, 20, 1, ground);
            group(0, 10, 20, 3, dirt);
            group(0, 6, 20, 1, death);
        break;
    }
}
setLevel();
function raycastLevel(x, y, changeX, changeY){
    var tX = x;
    var tY = y;
    for(var i = 0; i < 100; ++i){
        if(tX > 0 && tY > 0 && tX < (level.length-1) * 20 && tY < (level[0].length-1) * 20){
            if(level[floor(tX/20)][floor(tY/20)] !== 0){
                var shortChangeX = changeX/dist(changeX, changeY, 0, 0);
                var shortChangeY = changeY/dist(changeX, changeY, 0, 0);
                var n = 300;
                while(level[constrain(floor(tX/20), 0, level.length-1)][constrain(floor(tY/20), 0, level[0].length-1)] !== 0 || !(tX > 0 && tY > 0 && tX < (level.length-1) * 20 && tY < (level[0].length-1) * 20)){
                    --n;
                    tX -= shortChangeX
                    tY -= shortChangeY
                    if(n<=0){break;}
                }
                tX += shortChangeX;
                tY += shortChangeY;
                return {type: level[constrain(floor(tX/20), 0, level.length-1)][constrain(floor(tY/20), 0, level[0].length-1)], distance: dist(x, y, tX, tY)/200};
            }
        }
        x += changeX;
        y += changeY;
    }
    return {type: 0, distance: 1};
}
var gameTimer = 0;
function game(){
    try {
    fill(255, 0, 0)
    for(var i = 0; i < nets.length; ++i){
        var player = nets[i].playerData;
        nets[i].inputs[0].value = raycastLevel(player.x+10, player.y+10, 20, 0).distance
        nets[i].inputs[1].value = raycastLevel(player.x+10, player.y+10, -20, 0).distance
        nets[i].inputs[2].value = raycastLevel(player.x+10, player.y+10, 0, -20).distance
        var toBottom = raycastLevel(player.x+10, player.y+10, 0, 20)
        for(var j = 0; j < player.prevFloor.length; ++j){
            if(j < player.prevFloor.length-1){
                player.prevFloor[j].distance = player.prevFloor[j+1].distance;
                player.prevFloor[j].type = player.prevFloor[j+1].type;
            } else {
                player.prevFloor[j].distance = toBottom.distance;
                player.prevFloor[j].type = toBottom.type;
            }
        }
        for(var j = 0; j < player.prevFloor.length; ++j){
            nets[i].inputs[3+j*2].value = nets[i].playerData.prevFloor[j].distance
            nets[i].inputs[4+j*2].value = nets[i].playerData.prevFloor[j].type
        }
        //nets[i].inputs[3 + 2*player.prevFloor.length].value = player.fs/5;
        nets[i].inputs[3 + 2*player.prevFloor.length].value = 0.2;

        nets[i].getValue(true);

        if(player.alive){
            if(nets[i].outputs[1].value > JUMPSENS && player.fs === 0){
                player.fs = -JUMPFORCE;
            }
            player.y += player.fs;
            player.fs += GRAVITY;
            if(player.y > level[0].length * 20){player.alive = false;}
            if(abs(nets[i].outputs[0].value) > WALKSENS){
                if(nets[i].outputs[0].value < 0){
                    player.x -= SPEED;
                } else {
                    player.x += SPEED;
                }
            }
        }
        for(var x = 0; x < level.length; ++x){
            for(var y = 0; y < level[x].length; ++y){
                switch(level[x][y]){
                    case 1: {
                        if(touching(x*20, y*20, 20, 20, player.x, player.y, 20, 20)){
                            player.fs = 0;
                            player.y -= 0.5;
                        }
                        break;
                    }
                    case 2: {
                        if(touching(x*20, y*20, 20, 20, player.x, player.y, 20, 20)){
                            player.alive = false;
                        }
                        break;
                    }
                    case 3: {
                        if(touching(x*20, y*20, 20, 20, player.x, player.y, 20, 20)){
                            if(nets[i].outputs[0].value < -0.5){
                                player.x += 2
                            }
                            if(nets[i].outputs[0].value > 0.5){
                                player.x -= 2
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    ++gameTimer
    if(gameTimer >= 20 * 60){runGeneration(); gameTimer = 0; return;}
    for(var i = 0; i < nets.length; ++i){
        if(nets[i].playerData.alive){return;}
    }
    gameTimer = 0; 
    runGeneration();
    } catch(e){
        fill(255, 255, 255)
        fontSize(10);
        fillText(e.stack, 10, 150)
    }
}
function renderGame(){
    try {
    for(var i = 0; i < nets.length; ++i){
        var player = nets[i].playerData;
        fill(255, 128, 128)
        if(player.alive){
            fill(255, 0, 0)
        }
        rect(player.x, player.y, 20, 20)
    }
    for(var x = 0; x < level.length; ++x){
        for(var y = 0; y < level[x].length; ++y){
            switch(level[x][y]){
                case 1: {
                    fill(0, 255, 0)
                    rect(x*20, y*20, 20, 20)
                    break;
                }
                case 2: {
                    fill(255, 0, 0)
                    rect(x*20, y*20, 20, 20)
                    break;
                }
                case 3: {
                    fill(133, 86, 0)
                    rect(x*20, y*20, 20, 20)
                    break;
                }
            }
        }
    }
    } catch(e){
    }
}
var fast = false;
function draw(){
    try {
    //if(running){
        //for(var i = 0; i < iterationsPerFrame; ++i){
            //runGeneration();
        //}
    //}
    background(0, 0, 0)
    fill(255, 255, 255);
    //writeInfoToScreen();
    if(fast){
        for(var i = 0; i < iterationsPerFrame; ++i){
            game();
        }
        renderGame();
    } else {
        game();
        renderGame();
    }
    } catch (e){
        fill(0, 0, 0)
        fontSize(10)
        fillText(e.stack, 10, 100)
    }
    if(inputStart[" "]){
        fast = !fast;
    }
    if(inputStart["ArrowLeft"]){
        --levelToTrainOn;
        setLevel();
        runGeneration();
    }
    if(inputStart["ArrowRight"]){
        ++levelToTrainOn;
        setLevel();
        runGeneration();
    }
    if(inputStart["r"]){
        runGeneration();
        for(var i = 0; i < nets.length; ++i){
            nets[i].reset();
        }
    }
    fill(255, 255, 255)
    fontSize(15);
    fillText(nets[0].outputs[0].value, 10, 100)
}