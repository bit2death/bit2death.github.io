
            var canvas;
            var ctx;
            var mouseOverColor = "#d4bfff";

            var PongBall = {
                x: 100,
                y: 100,
                xinert: 1,
                yinert: 1,
                speed: 600,
                // 0 = NO curve, 1 = curve DOWN, -1 = curve UP
                curving: 0,
                size: 10,
                countdown: 200,
                bounces: 0
            };
            var player1 = {
                y: 80,
                dir: 0,
                size: 3,
                score: 0,
                lives: 5,
                speed: 1500
            };
            var player2 = {
                y: 80,
                dir: 0,
                size: 3,
                score: 0,
                lives: 5,
                speed: 1500
            };

            var cRect;
            var canvasX;
            var canvasY;
            var mouseClick = false;
            var animateTitle = true;

            // MENU LOOP

            function refreshFrame() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.rect(0, 0, canvas.width, canvas.height);
                ctx.fill();
                ctx.fillStyle = "#ff0000";
            }

            function init() {
                console.log("Pong Game Initialized!");

                canvas = document.getElementById("CanvasPong");
                ctx = canvas.getContext("2d");
                ctx.fillStyle = "black";

                // USED TO BE "window.innerWidth" BUT IT'S NOW 1080

                canvas.width = 1920/4;// Math.max(window.innerWidth - 75, 1224);
                canvas.height = 1080/4;// Math.max((window.innerWidth * 750 / 1224) - 75, 576);
                ctx.beginPath();
                ctx.rect(0, 0, canvas.width, canvas.height);
                ctx.fill();

                player1.size *= canvas.width / 30;
                player1.speed = Math.round(player1.speed *= canvas.width / 3000);
                player2.size *= canvas.width / 30;
                player2.speed = Math.round(player2.speed *= canvas.width / 3000);
                PongBall.x = canvas.width / 2;
                PongBall.y = canvas.height / 2;
		PongBall.speed = Math.round(PongBall.speed *= canvas.width / 3000);


                canvas.addEventListener("mousemove", function (e) {
                    cRect = canvas.getBoundingClientRect();
                    canvasX = Math.round(e.clientX - cRect.left);
                    canvasY = Math.round(e.clientY - cRect.top);

                    ctx.font = "20px arial";
                });
                canvas.addEventListener("mouseup", function () {
                    mouseClick = false;
                });
                canvas.addEventListener("mousedown", function () {
                    mouseClick = true;
                });
                displayTitle();
            }

            function displayTitle() {
                refreshFrame();
                if (animateTitle) {


                    ctx.font = "90px impact";
                    ctx.fillStyle = mouseOverColor;
                    ctx.fillText("PONG", 40, canvas.height / 2 - 75, );
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText("PONG", 40, canvas.height / 2 - 80);

                    button("Start Game", 40, canvas.height / 2, 600, 200);

                    ctx.fillText("X: " + canvasX + ", y: " + canvasY, 10, 80);
                    requestAnimationFrame(displayTitle);
                }
            }

            function button(text, x, y, w, h) {

                let btnPos = {
                    x: x,
                    y: y,
                    w: w,
                    h: h
                };

                ctx.fillStyle = "#ffffff";


                if (
                    canvasX >= btnPos.x &&
                    canvasX <= btnPos.x + btnPos.w &&
                    canvasY >= btnPos.y &&
                    canvasY <= btnPos.y + btnPos.h
                ) {
                    ctx.fillStyle = mouseOverColor;
                    if (mouseClick) {
                        animateTitle = false;
                        game();
                    }
                }
                ctx.beginPath();
                ctx.rect(btnPos.x, btnPos.y, btnPos.w, btnPos.h);
                ctx.fill();
                ctx.fillStyle = "#000000";
                ctx.fillText(text, x + 20, y + h / 2 + 30);
            }

            // ++++++++++===================================  THE GAME  ===================================++++++++++

            var animateGame = true;

            window.addEventListener("keydown", playerInfluence);
            window.addEventListener("keyup", playerStop);

            var lastTime = (new Date()).getTime();
            var delta = 0;
            var currentTime = 0;

            function game() {
                if (animateGame) {

                    requestAnimationFrame(game);

                    currentTime = (new Date()).getTime();
                    delta = (currentTime - lastTime) / 1000;

                    refreshFrame();

                    background();

                    ballMovement();

                    playerMovement();

                    debugMenu();

                    lastTime = currentTime;

                }
            }

            function debugMenu(){
                // ctx.fillText(player1.y + ", " + player1.dir, 50, 80);

            }

            var highscore = 0;

            function background() {
                ctx.font = "50px impact";
                ctx.fillStyle = "#a1321f";
                ctx.fillText(player2.score, canvas.width / 2 - 110, 80);
                ctx.fillStyle = "#ff5533";
                ctx.fillText(player2.score, canvas.width / 2 - 110, 75);

                ctx.fillStyle = "#321fa1";
                ctx.fillText(player1.score, canvas.width / 2 + 80, 80);
                ctx.fillStyle = "#5533ff";
                ctx.fillText(player1.score, canvas.width / 2 + 80, 75);
                ctx.fillStyle = "#202020";
                ctx.beginPath();
                ctx.rect(canvas.width/2 - 5, 0, 10, canvas.height);
                ctx.fill();

                ctx.fillStyle = "#282828";
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, PongBall.size * 20 + 5, 0, 2 * Math.PI, 1, false);
                ctx.fill();
                ctx.fillStyle = "#2e2e2e";
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, PongBall.size * 20, 0, 2 * Math.PI, 1, false);
                ctx.fill();

                ctx.fillStyle = "#ffffff";
                ctx.font = "100px impact";
                ctx.fillText(PongBall.bounces, canvas.width / 2 - 25, canvas.height / 2 - 40);

                if (PongBall.bounces > highscore) {
                    highscore = PongBall.bounces;
                }

                ctx.font = "50px impact";
                ctx.fillText("HIGH SCORE: " + highscore, canvas.width / 2 - 150, canvas.height / 2 + 60);

            }

            function playerStop(keyup) {
              if(["w", "s", "ArrowUp", "ArrowDown"].includes(keyup.key)){
                keyup.preventDefault();
                keyup.key === "w" ? player1.dir += 1 : null;

                keyup.key === "s" ? player1.dir -= 1 : null;

                keyup.key === "ArrowUp" ? player2.dir += 1 : null;

                keyup.key === "ArrowDown" ? player2.dir -= 1 : null;

                player1.dir = Math.sign(player1.dir);
                player2.dir = Math.sign(player2.dir);
              }
            }

            function playerInfluence(keydown) {

              if(["w", "s", "ArrowUp", "ArrowDown"].includes(keydown.key)){
                keydown.preventDefault();

                keydown.key === "w" ? player1.dir -= 1 : null;

                keydown.key === "s" ? player1.dir += 1 : null;

                keydown.key === "ArrowUp" ? player2.dir -= 1 : null;

                keydown.key === "ArrowDown" ? player2.dir += 1 : null;

                player1.dir = Math.sign(player1.dir);
                player2.dir = Math.sign(player2.dir);
              }
            }

            function drawPlayer(x, y, size) {
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.rect(x, y, 20, size);
                ctx.fill();
            }

            function playerMovement() {

                    player1.y += player1.dir * player1.speed * delta;
                if(player1.y <= 5)
                    player1.y = 5;
                if(player1.y >= canvas.height - player1.size - 5)
                    player1.y = canvas.height - player1.size - 5;

                    player2.y += player2.dir * player2.speed * delta;
                if(player2.y <= 5)
                    player2.y = 5;
                if(player2.y >= canvas.height - player2.size - 5)
                    player2.y = canvas.height - player2.size - 5;

                drawPlayer(5, player1.y, player1.size);
                drawPlayer(canvas.width - 25, player2.y, player2.size);

            }

            function ballMovement() {

                PongBall.curving = Math.max(Math.min(PongBall.curving, 15), -15);

                PongBall.y += PongBall.curving + PongBall.yinert * PongBall.speed * delta;

                PongBall.curving += PongBall.curving * 1.25 * (PongBall.bounces / 5 + 1) * delta;

                if (PongBall.y > canvas.height - PongBall.size) {
                    PongBall.y = canvas.height - PongBall.size;
                    PongBall.yinert = -1;
                    PongBall.curving = 0;
                } else if (PongBall.y < PongBall.size) {
                    PongBall.y = PongBall.size;
                    PongBall.yinert = 1;
                    PongBall.curving = 0;
                }

                // X SPEED MANAGEMENT
                PongBall.x += (PongBall.bounces/2 + 1) * PongBall.xinert * PongBall.speed * delta;


                if (PongBall.x >= canvas.width - 25 - PongBall.size) {
                    if (player2.y - PongBall.size/2 <= PongBall.y + PongBall.size/2 && player2.y + player2.size >= PongBall.y) {
                        PongBall.xinert = -1;
                        PongBall.bounces += 1;

                        PongBall.yinert += player2.dir;
                        PongBall.curving = -player2.dir;
                        player2.dir !== 0 ? PongBall.yinert = player2.dir * 2 : null;

                    } else {
                        player2.score += 1;
                        PongBall.x = canvas.width / 2;
                        PongBall.y = canvas.height / 2;
                        PongBall.xinert = -1;

                        PongBall.curving = 0;
                        PongBall.bounces = 0;
                    }

                } else if (PongBall.x <= 30 + PongBall.size) {
                    if (player1.y <= PongBall.y && player1.y + player1.size >= PongBall.y) {
                        PongBall.xinert = 1;
                        PongBall.bounces += 1;

                        PongBall.yinert += player1.dir * 1.5;
                        PongBall.curving = -player1.dir;
                        player1.dir !== 0 ? PongBall.yinert = player1.dir * 2 : null;

                    } else {
                        player1.score += 1;
                        PongBall.x = canvas.width / 2;
                        PongBall.y = canvas.height / 2;
                        PongBall.xinert = -1;

                        PongBall.curving = 0;
                        PongBall.bounces = 0;
                    }
                }


                var glow = ctx.createRadialGradient(PongBall.x, PongBall.y, 0, PongBall.x, PongBall.y, PongBall.size * 2);


                if (PongBall.curving === 0) {
                    BallGlowColor = "#ffffff";
                } else if (PongBall.curving > 0) {
                    BallGlowColor = "#ffff00";
                } else if (PongBall.curving < 0) {
                    BallGlowColor = "#00ffff";
                }


                glow.addColorStop(0, BallGlowColor);

                glow.addColorStop(1, "#000000");

                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(PongBall.x, PongBall.y, PongBall.size * 2, 0, 2 * Math.PI, 1, false);
                ctx.fill();

                ctx.fillStyle = BallGlowColor;
                ctx.beginPath();
                ctx.arc(PongBall.x, PongBall.y, PongBall.size, 0, 2 * Math.PI, 1, false);
                ctx.fill();

            }
