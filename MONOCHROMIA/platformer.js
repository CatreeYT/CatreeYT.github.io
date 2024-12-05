framerate(60);
            var GRAVITY = 0.07;
            var player = {
                x: 10,
                y: 10,
                spawnX: null,
                spawnY: null,
                width: 20,
                height: 20,
                extraPixelsStanding: 0,
                setSpawn: function(x, y){
                    player.spawnX = x;
                    player.spawnY = y;
                },
                die: function(){
                    player.x = player.spawnX;
                    player.y = player.spawnY;
                    player.fs = 0;
                    player.hs = 0;
                },
                color: new colorObj(255, 0, 0),
                fs: 0,
                hs: 0,
                maxWalkSpeed: 2,
                maxFallSpeed: 6,
                acceleration: 0.6,
                jumpForce: 4,
                onJump: function(){},
                airFriction: 0.1, // Base Value = 0.15
                groundFriction: 0.25,
                coyoteFramesLeft: 0,
                coyoteTime: 10,
                jumpInfluenceFrames: 0,
                maxJumpInfluence: 8,
                direction: 1, // 1 = right, -1 = left,
                canMove: true,
                endJumpDamp: 0.6,
                endJumpPrematureDamp: 0.3
            };
            player.setSpawn(player.x, player.y);
            function stand(x, y, w, h, friction){
                player.y = y - player.height - player.extraPixelsStanding+1;
                player.fs = 0;
                player.groundFriction = friction;
                player.coyoteFramesLeft = player.coyoteTime;
            }

            var pixelsOfTest = 3;

            // This is the base for all block types
            // It can be changed to suit the need of any other type
            function block(x, y, w, h, friction = 0.4, clr = new colorObj(255, 255, 255), whenGrounded, actionOnFrame){
                if(!whenGrounded){whenGrounded = stand}
                if(!actionOnFrame){actionOnFrame = function(){}}
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.friction = friction;
                this.color = clr;

                this.sidesColliding = 0b1111 // LTRB

                this.collidingWithPlayer = function(side){
                    switch(side){
                        case 1: // Left
                            return touching(this.x-2, this.y, pixelsOfTest+4, this.h, player.x + player.width - pixelsOfTest, player.y, pixelsOfTest, player.height) && this.sidesColliding & 0b1000;
                            break;
                        case 2: // Top
                            return touching(this.x, this.y, this.w, pixelsOfTest, player.x, player.y + player.height + player.extraPixelsStanding - pixelsOfTest, player.width, pixelsOfTest) && this.sidesColliding & 0b0100;
                            break;
                        case 3: // Right
                            return touching(this.x + this.w - pixelsOfTest, this.y, pixelsOfTest+2, this.h, player.x, player.y, pixelsOfTest, player.height) && this.sidesColliding & 0b0010;
                            break;
                        case 4: // Bottom
                            return touching(this.x, this.y + this.h - pixelsOfTest, this.w, pixelsOfTest, player.x, player.y, player.width, pixelsOfTest) && this.sidesColliding & 0b0001;
                            break;
                        default:
                            return touching(this.x, this.y, this.w, this.h, player.x, player.y, player.width, player.height + player.extraPixelsStanding);
                    }
                }
                this.draw = function(){
                    if(this.color.ready === undefined){
                        fill(this.color)
                        rect(this.x, this.y, this.w, this.h)
                    } else {
                        this.color.draw(this.x, this.y, 2, 2, false, false, this.tileInSet);
                    }
                }
                this.whenGrounded = function(){whenGrounded(this.x, this.y, this.w, this.h, this.friction, this.color)};
                this.changeWhenGrounded = function(newFunction){whenGrounded = newFunction;}
                this.actionOnFrame = actionOnFrame;
            }
            
            var level = [];
            function doLevel(){
                for(var i = 0; i < level.length; ++i){
                    var item = level[i];
                    var touchingPlayer = item.collidingWithPlayer();
                    item.actionOnFrame();
                    item.draw();
                    if(item.collidingWithPlayer(2) && player.fs >= 0){
                        item.whenGrounded();
                    }
                    if(touchingPlayer){
                        if(item.collidingWithPlayer(1) && player.hs > 0){
                            player.x = item.x - player.width;
                            player.hs = 0;
                        }
                        if(item.collidingWithPlayer(3) && player.hs < 0){
                            player.x = item.x + item.w;
                            player.hs = 0;
                        }
                        if(item.collidingWithPlayer(4) && player.fs < 0){
                            player.y = item.y + item.h;
                            player.fs = -0.25 * player.fs;
                            player.jumpInfluenceFrames = 0;
                        }
                    }
                }
            }
            // Default Keybinds
            // Add more for pressing other buttons incase player wants different binds
            var binds = {
                moveLeft: "ArrowLeft",
                moveRight: "ArrowRight",
                jump: "ArrowUp",
            };
            function extraControls(){}
            function doControls(){
                var currentFriction = player.coyoteFramesLeft <= 0 ? player.airFriction : player.groundFriction;
                if(abs(player.hs) > 3){
                    currentFriction *= 0.5
                }
                if(player.canMove){
                    if(pressing[binds.moveRight] && player.hs < player.maxWalkSpeed){player.hs += player.acceleration;}
                    if(pressing[binds.moveLeft] && player.hs > -player.maxWalkSpeed){player.hs -= player.acceleration;}
                }
                let justJumped = false;
                if(pressing[binds.jump] && player.coyoteFramesLeft > 0){
                    player.jumpInfluenceFrames = player.maxJumpInfluence;
                    player.coyoteFramesLeft = 0;
                    justJumped = true;
                }
                if(pressing[binds.jump] && player.jumpInfluenceFrames > 0){
                    if(player.fs > -player.jumpForce-1){
                        player.fs = -player.jumpForce + (player.maxJumpInfluence - player.jumpInfluenceFrames)/4;
                    }
                    --player.jumpInfluenceFrames;
                    if(player.jumpInfluenceFrames <= 0){
                        player.fs *= player.endJumpDamp
                    }
                } else {
                    if(!pressing[binds.jump] && player.jumpInfluenceFrames > 0){
                        player.fs *= player.endJumpPrematureDamp
                    }
                    player.jumpInfluenceFrames = 0;
                }
                if(player.coyoteFramesLeft > 0){--player.coyoteFramesLeft;}
                player.x += player.hs;
                if(player.hs !== 0){
                    if((player.hs > 0 && player.hs - currentFriction < 0) || (player.hs < 0 && player.hs + currentFriction > 0)){
                        player.hs = 0;
                    } else {
                        player.hs -= Math.sign(player.hs) * currentFriction;
                    }
                }
                if(player.fs > player.maxFallSpeed){player.fs = player.maxFallSpeed;}
                if(justJumped){
                    player.onJump();
                }
                player.y += player.fs;
                player.fs += GRAVITY;
                if(!(pressing[binds.moveLeft] && pressing[binds.moveRight]) && player.canMove){
                    if(pressing[binds.moveLeft]){player.direction = -1;}
                    if(pressing[binds.moveRight]){player.direction = 1;}
                }
                extraControls();
            }