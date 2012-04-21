"use strict";

Game.Screen = Game.Class({
    initialize: function ($canvas) {
        this.$canvas = $canvas;
        this.$canvas.css("border", "1px solid black");
    }
});