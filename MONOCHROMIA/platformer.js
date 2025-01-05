framerate(60); // Set the framerate of the game to 60 frames per second

// Physics constants
var GRAVITY = 0.07; // The gravitational force applied to the player

// Player object and its properties
var player = {
    x: 10, // Initial x-coordinate
    y: 10, // Initial y-coordinate
    spawnX: null, // Spawn x-coordinate (set later)
    spawnY: null, // Spawn y-coordinate (set later)
    width: 20, // Player width
    height: 20, // Player height
    extraPixelsStanding: 0, // Extra pixels for collision when standing
    
    // Set the spawn location
    setSpawn: function(x, y) {
        player.spawnX = x;
        player.spawnY = y;
    },

    // Reset player position and state upon death
    die: function() {
        player.x = player.spawnX;
        player.y = player.spawnY;
        player.fs = 0; // Reset vertical speed
        player.hs = 0; // Reset horizontal speed
    },

    color: new colorObj(255, 0, 0), // Player's color (red)
    fs: 0, // Vertical speed (fall speed)
    hs: 0, // Horizontal speed
    maxWalkSpeed: 2, // Maximum walking speed
    maxFallSpeed: 6, // Maximum falling speed
    acceleration: 0.6, // Acceleration when moving
    jumpForce: 4, // Force applied when jumping
    onJump: function() {}, // Callback for when the player jumps
    airFriction: 0.1, // Friction applied while airborne
    groundFriction: 0.25, // Friction applied on the ground
    coyoteFramesLeft: 0, // Remaining frames for coyote time
    coyoteTime: 10, // Total coyote time frames
    jumpInfluenceFrames: 0, // Frames left to influence jump height
    maxJumpInfluence: 8, // Maximum frames to influence jump
    direction: 1, // Direction of movement (1 = right, -1 = left)
    canMove: true, // Whether the player can move
    endJumpDamp: 0.6, // Damping factor when jump ends naturally
    endJumpPrematureDamp: 0.3 // Damping factor when jump ends early
};

// Set initial spawn location
player.setSpawn(player.x, player.y);

// Function to place the player on a platform
function stand(x, y, w, h, friction) {
    player.y = y - player.height - player.extraPixelsStanding + 1; // Align player on top of the platform
    player.fs = 0; // Reset vertical speed
    player.groundFriction = friction; // Set platform's friction
    player.coyoteFramesLeft = player.coyoteTime; // Reset coyote time
}

var pixelsOfTest = 3; // Number of pixels used for collision testing

// Base class for blocks
function block(x, y, w, h, friction = 0.4, clr = new colorObj(255, 255, 255), whenGrounded, actionOnFrame) {
    if (!whenGrounded) { whenGrounded = stand; } // Default grounded behavior
    if (!actionOnFrame) { actionOnFrame = function() {}; } // Default action per frame

    // Block properties
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.friction = friction;
    this.color = clr;

    this.sidesColliding = 0b1111; // Bitmask for allowed collisions (left, top, right, bottom)

    // Check collision with the player
    this.collidingWithPlayer = function(side) {
        switch (side) {
            case 1: // Left
                return touching(this.x - 2, this.y, pixelsOfTest + 4, this.h, player.x + player.width - pixelsOfTest, player.y, pixelsOfTest, player.height) && this.sidesColliding & 0b1000;
            case 2: // Top
                return touching(this.x, this.y, this.w, pixelsOfTest, player.x, player.y + player.height + player.extraPixelsStanding - pixelsOfTest, player.width, pixelsOfTest) && this.sidesColliding & 0b0100;
            case 3: // Right
                return touching(this.x + this.w - pixelsOfTest, this.y, pixelsOfTest + 2, this.h, player.x, player.y, pixelsOfTest, player.height) && this.sidesColliding & 0b0010;
            case 4: // Bottom
                return touching(this.x, this.y + this.h - pixelsOfTest, this.w, pixelsOfTest, player.x, player.y, player.width, pixelsOfTest) && this.sidesColliding & 0b0001;
            default:
                return touching(this.x, this.y, this.w, this.h, player.x, player.y, player.width, player.height + player.extraPixelsStanding);
        }
    };

    // Draw the block
    this.draw = function() {
        if (this.color.ready === undefined) {
            fill(this.color);
            rect(this.x, this.y, this.w, this.h);
        } else {
            this.color.draw(this.x, this.y, 2, 2, false, false, this.tileInSet);
        }
    };

    // Execute action when player is grounded
    this.whenGrounded = function() { whenGrounded(this.x, this.y, this.w, this.h, this.friction, this.color); };
    this.changeWhenGrounded = function(newFunction) { whenGrounded = newFunction; }; // Change grounded behavior

    // Execute action per frame
    this.actionOnFrame = actionOnFrame;
}

// Array to hold level blocks
var level = [];

// Main loop to process the level
function doLevel() {
    for (var i = 0; i < level.length; ++i) {
        var item = level[i];
        var touchingPlayer = item.collidingWithPlayer();
        item.actionOnFrame(); // Execute block's frame action
        item.draw(); // Draw the block

        if (item.collidingWithPlayer(2) && player.fs >= 0) {
            item.whenGrounded(); // Place player on the block
        }

        if (touchingPlayer) {
            // Handle collisions
            if (item.collidingWithPlayer(1) && player.hs > 0) {
                player.x = item.x - player.width;
                player.hs = 0;
            }
            if (item.collidingWithPlayer(3) && player.hs < 0) {
                player.x = item.x + item.w;
                player.hs = 0;
            }
            if (item.collidingWithPlayer(4) && player.fs < 0) {
                player.y = item.y + item.h;
                player.fs = -0.25 * player.fs; // Bounce effect
                player.jumpInfluenceFrames = 0;
            }
        }
    }
}

// Default key bindings
var binds = {
    moveLeft: "ArrowLeft",
    moveRight: "ArrowRight",
    jump: "ArrowUp",
};

// Additional controls placeholder
function extraControls() {}

// Process player controls and physics
function doControls() {
    var currentFriction = player.coyoteFramesLeft <= 0 ? player.airFriction : player.groundFriction; // Determine friction based on ground/air

    if (Math.abs(player.hs) > 3) {
        currentFriction *= 0.5; // Reduce friction for high speeds
    }

    if (player.canMove) {
        if (pressing[binds.moveRight] && player.hs < player.maxWalkSpeed) {
            player.hs += player.acceleration; // Accelerate right
        }
        if (pressing[binds.moveLeft] && player.hs > -player.maxWalkSpeed) {
            player.hs -= player.acceleration; // Accelerate left
        }
    }

    let justJumped = false;

    if (pressing[binds.jump] && player.coyoteFramesLeft > 0) {
        player.jumpInfluenceFrames = player.maxJumpInfluence;
        player.coyoteFramesLeft = 0;
        justJumped = true;
    }

    if (pressing[binds.jump] && player.jumpInfluenceFrames > 0) {
        if (player.fs > -player.jumpForce - 1) {
            player.fs = -player.jumpForce + (player.maxJumpInfluence - player.jumpInfluenceFrames) / 4;
        }
        --player.jumpInfluenceFrames;
        if (player.jumpInfluenceFrames <= 0) {
            player.fs *= player.endJumpDamp;
        }
    } else {
        if (!pressing[binds.jump] && player.jumpInfluenceFrames > 0) {
            player.fs *= player.endJumpPrematureDamp;
        }
        player.jumpInfluenceFrames = 0;
    }

    if (player.coyoteFramesLeft > 0) { --player.coyoteFramesLeft; }

    player.x += player.hs; // Update horizontal position

    if (player.hs !== 0) {
        if ((player.hs > 0 && player.hs - currentFriction < 0) || (player.hs < 0 && player.hs + currentFriction > 0)) {
            player.hs = 0; // Stop if friction cancels velocity
        } else {
            player.hs -= Math.sign(player.hs) * currentFriction; // Apply friction
        }
    }

    if (player.fs > player.maxFallSpeed) { player.fs = player.maxFallSpeed; } // Limit fall speed

    if (justJumped) {
        player.onJump(); // Execute jump callback
    }

    player.y += player.fs; // Update vertical position
    player.fs += GRAVITY; // Apply gravity

    if (!(pressing[binds.moveLeft] && pressing[binds.moveRight]) && player.canMove) {
        if (pressing[binds.moveLeft]) { player.direction = -1; }
        if (pressing[binds.moveRight]) { player.direction = 1; }
    }

    extraControls(); // Execute additional controls
}
