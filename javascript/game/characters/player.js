"use strict";

Game.Characters.Player = Game.Class({
    initialize: function () {
        this.SPEED_X = 120;
        this.SPEED_Y = 100;
        this.SPEED_XY = 105;
        this.ACCEL = 40;

        this.position = { x: 30, y: 30 };
        this.targetVelocity = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
    },
    
    step: function (timeDelta, frameNumber, input) {
        this.resolveInput(timeDelta, frameNumber, input);
        this.resolveAcceleration();
        this.resolveVelocity(timeDelta);
    },

    resolveInput: function (timeDelta, frameNumber, input) {
        var xAxis = 0;
        var yAxis = 0;

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

    resolveAcceleration: function () {
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

    resolveVelocity: function (timeDelta) {
        this.position.x += this.velocity.x * timeDelta / 1000;
        this.position.y += this.velocity.y * timeDelta / 1000;
    },

    render: function (display, camera, resources) {
        resources.spritesheet['player'].drawSprite(display, camera, 24, this.position.x, this.position.y);
    }
});