"use strict"; // holding myself to "proper js standard"

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#000"
canvas.width = 256;
canvas.height = 144;
var particles = [];

/*
--------------------------------------------------
-------------------- classes ---------------------
--------------------------------------------------
*/

class particle{

    constructor(ctx, pos={x: 0, y: 0}, type = new sand){
        this.type = new sand;
        this.color = this.type.defaultColor;
        this.ctx = ctx;
        this.randomness = .3

        this.vel = {x: 0, y: 0};
        this.pos = pos;
        this.type = type;
    }

    

    update(){
        this.pos = this.type.phys(this.pos, this.vel);
        return this.pos;
    }
    draw(){
        this.type.draw(this.ctx, this.color, this.pos);
    }
}

particle.prototype ["operator+"] = function (operand){
    return operand;
}

class sand{
    constructor(){
        this.defaultColor="#fd9";
    }
    isSamePos(othP=new particle()){

    }
    phys(pos, vel){// needs surrounding particles
        if(pos.y < canvas.height - 1){
            pos.y += 1 + Math.round(Math.random() * 2 - 1);
            pos.x += Math.sign(Math.random() - .5) * Math.round(Math.random());
        }
        pos.x = Math.min(Math.max(pos.x, 0), canvas.width)
        pos.y = Math.min(Math.max(pos.y, 0), canvas.height)
        return pos;
    }
    draw(ctx, color, pos){
        ctx.fillStyle = color
        ctx.fillRect(Math.floor(pos.x), pos.y, 1, 1);
    }
}
/*
-----------------------------------------------------------------
-------------------- THE ACTUAL SCRIPT!!!!!! --------------------
-----------------------------------------------------------------
*/
for(let i = 0; i<200; i++){
    particles.push(new particle(ctx, {x: i, y: 0}));
}

function main(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let i=0;i<particles.length;i++){
        updPx(particles[i], i);
    }
    for(let i=0;i<particles.length;i++){
        drawPx(particles[i]);
    }
}

function updPx(particle, j){
    particle.update();
    for(var i=0; i<particles.length; i++){
        if(j != i){
            if(particle.pos.x == particles[i].pos.x &&
                particle.pos.y == particles[i].pos.y
                ){
                console.log("WAHOO");
                particle.pos.x += Math.ceil(Math.random()) * -Math.ceil(Math.random());
                particle.pos.y--;
            }
        }
    }
}

function drawPx(particle){
    particle.draw(ctx);
}

setInterval(main, 40);
