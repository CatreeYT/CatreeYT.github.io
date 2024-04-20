var nets = [];

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
}

/*
var aiInputsSize = 5; // Distance to left, Distance to right, distance to bottom, distance to top, player falling velocity
var aiOutputSize = 3; // Left/Right, Jump
function sortingFunction(a, b){
    return b.playerData.x - a.playerData.x; // Greatest to least
}
var netsWidth = 2;
var netsHeight = 3;
var amountOfNetsTraining = 40;
*/

var aiInputsSize = 2; // A and B
var aiOutputSize = 1;
function sortingFunction(a, b){
    return abs(abs(a.outputs[0].value)-xor(a.inputs[0], a.inputs[1])) - abs(abs(b.outputs[0].value)-xor(b.inputs[0], b.inputs[1]))
}
var netsWidth = 2;
var netsHeight = 3;
var amountOfNetsTraining = 100;


function net(length, width){
    var playerData = {
        x: 100,
        y: 100,
        fs: 0,
    };
    this.nodes = new Array(length-1).fill(new Array(width).fill(new node(width)))
    this.outputs = [];
    for(var i = 0; i < aiOutputSize; ++i){this.outputs.push(new node(0))}
    this.nodes.push(new Array(width).fill(new node(this.outputs.length)))
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
        var randomGenerated = 2;
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

function runGeneration(){
    for(var i = 0; i < nets.length; ++i){
        nets[i].update();
        nets[i].getValue();
    }
    nets.sort(sortingFunction)
    for(var i = 0; i < nets.length/2; ++i){
        nets[i+nets.length/2].copy(nets[i]);
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
    running = !running;
}
var running = false;
var iterationsPerFrame = 100;
function draw(){
    if(running){
        for(var i = 0; i < iterationsPerFrame; ++i){
            runGeneration();
        }
    }
    background(0, 0, 0)
    fill(255, 255, 255);
    writeInfoToScreen();
    if(inputStart.a){valA = 0;}
    if(inputStart.s){valA = 1;}
    if(inputStart.z){valB = 0;}
    if(inputStart.x){valB = 1;}
    nets[0].inputs[0].value = valA;
    nets[0].inputs[1].value = valB;
    nets[0].getValue(true);
    fill(255, 255, 255)
    fillText(abs(nets[0].outputs[0].value), 500, 40)
}