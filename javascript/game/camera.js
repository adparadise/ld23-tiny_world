"use strict";

Game.Camera = Game.Class({
    initialize: function () {
        this.offset = {
            x: -10,
            y: 10
        };
    },
    
    step: function (timeDelta, input) {
        var speed = 100;
        var distance = speed * timeDelta / 1000;
        
        if (input.buttonState.left) {
            this.offset.x += distance;
        } else if (input.buttonState.right) {
            this.offset.x -= distance;
        }

        if (input.buttonState.up) {
            this.offset.y += distance;
        } else if (input.buttonState.down) {
            this.offset.y -= distance;
        }
    }
});