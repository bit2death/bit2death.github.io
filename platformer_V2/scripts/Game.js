
// window.addEventListener("load", function(){

    console.log("javascript loaded");
    const canvas = document.getElementById("canvas");
    const canvasDiv = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    // setup

    canvas.width = 1920;
    canvas.height = 1080;
    ctx.imageSmoothingEnabled = false;

    class InputHandler {
        constructor(game){
            this.inFullScreen = false;
            this.game = game;
            // arrow function makes sure the event listener never forgets the e variable
            window.addEventListener("keydown", e => {
                if (["w", "a", "s", "d", "j", "k"].includes(e.key) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }
                else if (e.key === "/"){

                    if(!this.inFullScreen){
                        this.inFullScreen = true;

                        if (canvasDiv.requestFullscreen){
                            canvasDiv.requestFullscreen();
                        } else if (canvasDiv.webkitRequestFullscreen){
                            canvasDiv.webkitRequestFullscreen();
                        }else if (canvasDiv.msRequestFullscreen){
                            canvasDiv.msRequestFullscreen();
                        }
                    }else{

                        this.inFullScreen = false;
                        if (document.exitFullscreen){
                            document.exitFullscreen();
                        }else if (document.webkitRequestFullscreen){
                            document.webkitRequestFullscreen();
                        }else if (document.msExitFullscreen){
                            document.msExitFullscreen();
                        }
                    }
                }
            })
            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            })
        }
    }
    class Projectile {

    }
    class Particle {

    }
    class Player {
        constructor(game){

            this.sprites = new Image();
            this.sprites.src = "../assets/playersprites.png";
            this.game = game;
            this.width = 120;
            this.height = 200;

            // misc helpers

            this.facingRight = true;
            this.touchingGround = false;
            this.sliding = false;
            this.sprinting = false;
            this.justJumped = false;

            // position

            this.x = 20;
            this.y = 100;

            // vel = velocity

            this.velY = 0;
            this.velX = 0;
            this.xJumpBoost = 0;

            // changable/misc

            this.termVel = 10
            this.grav = 0;
            this.fallGrav = 4000;
            this.jumpGrav = 1300;
            this.jumpPower = 50000;

            this.drag = .85;
            this.friction = .85;
            this.speed = 5000;
            this.sprint = 8000
        }

        update(dt){

            this.speedY = 0;
            this.speedX = 0;

            // keybinds and what they do


            if(this.game.keys.includes("k") && !this.game.keys.includes("s")){
                this.sprinting = true;
                moveX(this, this.sprint);
            }else{
                this.sprinting = false;
                moveX(this, this.speed);
            }

            function moveX(parent, speed){
                if(parent.game.keys.includes("a")){
                    parent.speedX -= speed;
                    parent.facingRight = false;
                };
                if(parent.game.keys.includes("d")){
                    parent.speedX += speed;
                    parent.facingRight = true;
                };
            }
            if(this.game.keys.includes("s")) {
                this.speedY = this.speed;
            };

            if(this.game.keys.includes("w")){
                if(this.touchingGround){
                    this.speedY = -this.jumpPower;
                    this.speedX *= 7
                    this.justJumped = true;
                }
                else{
                    this.justJumped = false;
                }
                if(this.velY < 4.3)
                    this.grav = this.jumpGrav;
                else
                    this.grav = this.fallGrav;
            }else{
                this.velY = Math.max(this.velY, -20000);
                  this.grav = this.fallGrav;
            };

            // sliding check

            if(Math.abs(this.velX) > 4000 &&
                !this.game.keys.includes("a") &&
                !this.game.keys.includes("d") &&
                this.touchingGround
                ){
                this.sliding = true;
            }else {
              this.sliding = false;
              if (this.touchingGround && this.velX != 0 &&!this.game.keys.includes("a") && !this.game.keys.includes("d")){
                this.velX = 0;
              }

            }

            if (this.touchingGround){
                this.velX *= this.friction;
            }
            else{
                this.velX *= this.drag;
            }


            this.velX += this.speedX;
            this.velY += (this.speedY + this.grav);


            this.y += this.velY * dt;
            this.x += this.velX * dt;

            // collision placeholder

            if (this.y > 800){
                this.velY = 0;
                this.y = 800;
                this.touchingGround = true;
              }else this.touchingGround = false;
            if(this.x < 0){
                this.x = 0;
                this.velX = 0;
            }else if (this.x > this.game.width - this.width){
                this.x = this.game.width - this.width;
                this.velX = 0;
            }
        }

        draw(ctx){

            if (this.sliding){
                ctx.fillStyle = "#ff0000";
            }else {
                ctx.fillStyle = "#000000";
            }
            ctx.fillText("sliding: " + this.sliding, 100, 100);

            if (this.facingRight){
                // insert sprite facing right
            }else{
                // insert sprite facing left
            }
            ctx.fillText("facing right: " + this.facingRight, 100, 150)

            if (((this.game.keys.includes("a") ||
              this.game.keys.includes("d")) && !this.game.keys.includes("s")) &&
              this.sprinting &&
              this.touchingGround){
                // emit ground dust particles
                ctx.fillStyle = "#00ff00";
            }

            ctx.fillText("sprinting: " + this.sprinting, 100, 200);

            if(!this.touchingGround){
                ctx.fillStyle = "#0000ff";

                if(this.velY < 0){
                    ctx.fillStyle = "#00aaff";
                }

            }
            ctx.fillText("touching ground: " + this.touchingGround, 100, 250);

            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.sprites, 0, 0, 18, 30, this.x, this.y, this.width , this.height)
        }

    }
    class Enemy {

    }
    class Layer {

    }
    class Background {
        draw(ctx){
            ctx.fillStyle = "#3f3f3f";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
        }
    }

    class Tile {
      constructor(img, x, y, size){
        this.img = img;
        this.x = x;
        this.y = y;
        this.size = size;
      }
      draw(ctx){
        ctx.rect(x, y, size, size);
      }
    }

    class Stage {
      constructor(){

        this.tileList = [];

        this.tilesW = 32;
        this.tilesH = 18;
        this.tileSize = 60;
        // 48 x 27 tiles
        this.fr = new FileReader();
        this.levelData;
        this.stageData;
        fetch("../levels/testLevel.json")
            .then(response => response.json())
            .then(data => {
                this.levelData = data;
                this.stageData = this.levelData["a"];
                console.log(data["a"]);
            })
            .catch(error => console.error(error));
      }

      loadNewLevel(level){

      }

      loadNewStage(stage){
        this.tileLise = [];

        if (stage === "test"){
            this.stageData = fetch("../levels/testLevel.json")
                .then(response => response.json())
                .then(data => {
                    this.stageData = data;
                    console.log(data["a"]);
                })
                .catch(error => console.error(error));
        }

        if(this.levelData){
            for(let y=0; y<this.tilesH; y++){
                for(let x=0; x<this.tilesW; x++){
                    if (this.stageData.substring(tile, tile + 1) === "1"){
                        this.tileList.append( new Tile("", x*this.tileSize, y*this.tileSize, this.tileSize));
                        /*ctx.fillRect(x*this.tileSize,
                        y*this.tileSize,
                        canvas.width/this.tilesW,
                        canvas.height/this.tilesH);*/
                    }
                    tile ++;
                }
            }
        }

      }

      update(){
      }

      draw(ctx){
        ctx.fillStyle = "#000000000";
        let tile = 0;

        // for each tile, call tile.draw
        for (let i=0; i<this.tileList.length; i++){
            this.tileList[i].draw(ctx);
        }

        /*
            if(this.levelData){
                for(let y=0; y<this.tilesH; y++){
                    for(let x=0; x<this.tilesW; x++){
                        if (this.stageData.substring(tile, tile + 1) === "1"){
                            ctx.fillRect(x*this.tileSize,
                            y*this.tileSize,
                            canvas.width/this.tilesW,
                            canvas.height/this.tilesH);
                        }
                        tile ++;
                    }
                }
            }
            */
        }
    }

    class UI {

    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this)
            this.background = new Background(this);
            this.stage = new Stage(this);
            this.keys = [];
        }
        update(dt){
            this.player.update(dt);
        }
        draw(ctx){
            this.background.draw(ctx)
            this.stage.draw(ctx)
            this.player.draw(ctx);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // animation loop
    var lastUpdate = Date.now();
    var now = lastUpdate;
    var dt = 0;
    var fps = 60;
    var maxFPS = 1000/fps;
    ctx.font = "bold 40px monospace";

    function animate(){
        now = Date.now();

        requestAnimationFrame(animate);
        if ((now - lastUpdate) >= maxFPS){
          dt = (now - lastUpdate) / 1000/60;
          game.update(dt);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.draw(ctx);
          lastUpdate = now;
        }

    }
    animate();
// });

// https://www.youtube.com/watch?v=EvC3ge_puQk

/*

music:

Cave:
https://jummbus.bitbucket.io/#j5N04caven320s0k0l00e0bt1Ka7g0fj07r1O_U0000000000i0o233T0v0su00f010c500q8610Oa4d190w5h2E11bT8v0iu08f010o60320ja2h110jaq1519a5hid0a0w2h0M0000000000000000MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMME21900T1v0qu01f0000qED16315aek00Ka3vd0a0AbF6B0Q07bePb994R0000E2b6637T2v0mu02f0000qMB191100Da5d021w1E1bfT2v0lu02f180q050Oatd070w1E112b4zgid5pU0000018QlDw0018Q4zhmu0008y8y8y8y00000i01800000p25oFDDu24tcW7h2FDdWN7w170Av00Kj8-Q4uC8Z0hZE5S97op7Ez3wQRtg8FoCHyVAjGsTGFwzwQNt4FOiAPCYABgs7B2Dej0erMcM1Mu8Be8qAsTJuSe3PFjAVPerM5r3wYYkVjIPCZv7hMupasVWpPuPywUfaBehHkVKCnU8MPnMIOZcLQIz8LVdAFB-nOcy_yH1wi_5cAynYipaxvCcBgLVBCsB-iOky_C33bZuNHYiOdznV1CF6LAYz8R-qslCnYkOdi-Cab82JhG2QWlezj5FQGt6BhFkqoJeBjEQNqtaDhQxji5EyRxqhji5E5d4mybi5F5d8k2tewteEQrFN0te0

*/
