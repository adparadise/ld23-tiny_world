"use strict";

Game.Display = Game.Class({
    initialize: function ($canvas) {
        this.$canvas = $canvas;
        this.$canvas.css("border", "1px solid black");
        this.context = this.$canvas[0].getContext('2d');
    }
});