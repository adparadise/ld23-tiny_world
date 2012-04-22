/*global Game, head, window, $, _*/
"use strict";

Game.Characters.Player = Game.Class({
    initialize: function () {
        this.SPEED_X = 120;
        this.SPEED_Y = 100;
        this.SPEED_XY = 105;
        this.ACCEL = 40;

        this.position = { x: 50, y: 50 };
        this.targetVelocity = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.radius = 8;
        this.isDead = false;
        this.state = false;
        this.inStateSince = 0;
    },
    
    step: function (timeDelta, frameNumber, input) {
        this.resolveInput(input);
        this.resolveAcceleration(timeDelta, frameNumber);
    },

    resolveInput: function (input) {
        var xAxis = 0;
        var yAxis = 0;
        if (this.isDead) {
            return;
        }

        if (input.buttonState.left) {
            xAxis = -1;
        } else if (input.buttonState.right) {
            xAxis = 1;
        }
        if (input.buttonState.up) {
            yAxis = -1;
        } else if (input.buttonState.down) {
            yAxis = 1;
        }

        if (xAxis !== 0 || yAxis !== 0) {
            if (xAxis !== 0 && yAxis !== 0) {
                this.targetVelocity.x = xAxis * this.SPEED_XY;
                this.targetVelocity.y = yAxis * this.SPEED_XY;
            } else {
                this.targetVelocity.x = xAxis * this.SPEED_X;
                this.targetVelocity.y = yAxis * this.SPEED_Y;
            }
        } else {
            this.targetVelocity.x = 0;
            this.targetVelocity.y = 0;
        }
    },

    resolveAcceleration: function (timeDelta) {
        var deltaX, deltaY, deltaAbs;
        if (this.targetVelocity.x !== this.velocity.x ||
            this.targetVelocity.y !== this.velocity.y) {
            deltaX = this.targetVelocity.x - this.velocity.x;
            deltaY = this.targetVelocity.y - this.velocity.y;
            deltaAbs = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            this.velocity.x += deltaX * this.ACCEL / deltaAbs;
            this.velocity.y += deltaY * this.ACCEL / deltaAbs;

            if ((this.targetVelocity.x - this.velocity.x) * deltaX < 0 ||
                (this.targetVelocity.y - this.velocity.y) * deltaY < 0) {
                this.velocity.x = this.targetVelocity.x;
                this.velocity.y = this.targetVelocity.y;
            }
        }
    },

    resolveState: function (frameNumber) {
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            if (this.state !== 'moving') {
                this.state = 'moving';
                this.inStateSince = frameNumber;
            }
        } else {
            this.state = false;
        }
    },

    wasKilled: function () {
        this.isDead = true;
        this.targetVelocity.x = 0;
        this.targetVelocity.y = 0;
    },

    getSpriteID: function (frameNumber) {
        var frameFrequency = 5;
        var framesSinceStart;
        var frameCount = 0;
        var spriteID = 0;
        if (this.isDead) {
            return Game.Constants.resourceDefinitions.player.sets.dead[0];
        } else if (this.state === 'moving') {
            framesSinceStart = Math.floor((frameNumber - this.inStateSince) / frameFrequency);
            if (this.velocity.x > 0) {
                frameCount = Game.Constants.resourceDefinitions.player.sets.walkRight.length;
                spriteID = Game.Constants.resourceDefinitions.player.sets.walkRight[framesSinceStart % frameCount];
            } else {
                frameCount = Game.Constants.resourceDefinitions.player.sets.walkLeft.length;
                spriteID = Game.Constants.resourceDefinitions.player.sets.walkLeft[framesSinceStart % frameCount];
            }
            
            return spriteID;
        } else {
            return Game.Constants.resourceDefinitions.player.sets.stand[0];
        }
    },

    render: function (display, camera, resources, frameNumber) {
        var spriteID = this.getSpriteID(frameNumber);
        var span = 1;
        if (this.isDead) {
            span = 2;
        }
        resources.spritesheet.player.drawSprite(display, camera, spriteID, 
                                                this.position.x, this.position.y, span);
    }
});