/*global Game, head, window, $, _*/
"use strict";

Game.Characters.Enemy = Game.Class({
    initialize: function (position) {
        this.SPEED_X = 140;
        this.SPEED_Y = 80;
        this.SPEED_XY = 90;
        this.ACCEL = 2;
        this.position = {
            x: position.x,
            y: position.y
        };
        this.priorPosition =  {
            x: position.x,
            y: position.y
        };
        this.distanceTraveled = 0;
        this.targetVelocity = { 
            x: 0, 
            y: 0 
        };
        this.velocity = { 
            x: 0, 
            y: 0 
        };
        this.radius = 8;
    },

    step: function (timeDelta, frameNumber, player) {
        this.persuePlayer(timeDelta, frameNumber, player);
        this.resolveAcceleration(timeDelta);
    },

    persuePlayer: function (timeDelta, frameNumber, player) {
        var deltaX, deltaY;
        var closeThreshold = this.radius / 2;
        deltaX = player.position.x - this.position.x;
        deltaY = player.position.y - this.position.y;
        if (Math.abs(deltaX) < closeThreshold) {
            deltaX = 0;
        } else if (deltaX < 0) {
            deltaX = -1;
        } else {
            deltaX = 1;
        }
        if (Math.abs(deltaY) < closeThreshold) {
            deltaY = 0;
        } else if (deltaY < 0) {
            deltaY = -1;
        } else {
            deltaY = 1;
        }
        if (deltaX !== 0 && deltaY !== 0) {
            this.targetVelocity.x = deltaX * this.SPEED_XY;
            this.targetVelocity.y = deltaY * this.SPEED_XY;
        } else {
            this.targetVelocity.x = deltaX * this.SPEED_X;
            this.targetVelocity.y = deltaY * this.SPEED_Y;
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
        var distance = Math.sqrt(Math.pow(this.priorPosition.x - this.position.x, 2) + 
                                 Math.pow(this.priorPosition.y - this.position.y, 2));
        this.distanceTraveled += distance;
        
        this.priorPosition.x = this.position.x;
        this.priorPosition.y = this.position.y;
    },

    getSpriteID: function (frameNumber) {
        var distanceStep = 10;
        var frameCount = Game.Constants.resourceDefinitions.enemy.sets.roll.length;
        var index = Math.floor(this.distanceTraveled / distanceStep) % frameCount;
        var spriteID = Game.Constants.resourceDefinitions.enemy.sets.roll[index];

        return spriteID;
    },

    render: function (display, camera, resources) {
        var spriteID = this.getSpriteID();
        resources.spritesheet.enemy.drawSprite(display, camera, spriteID, this.position.x, this.position.y);
    }
});