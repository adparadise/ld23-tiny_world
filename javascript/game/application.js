"use strict";

Game.Application = Game.Class({
    initialize: function ($canvas) {
        this.screen = new Game.Screen($canvas);
    }
});