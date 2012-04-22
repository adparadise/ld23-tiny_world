"use strict";

Game.Characters.Enemy = Game.Class({
    initialize: function (position) {
        this.position = {
            x: position.x,
            y: position.y
        }
    },

    render: function (display, camera, resources) {
        resources.spritesheet['enemy'].drawSprite(display, camera, 0, this.position.x, this.position.y);
    }
});