/*global Game, head, window, $, _*/
"use strict";

Game.Display = Game.Class({
    initialize: function ($canvas) {
        this.scale = 1;
        this.hwScale = 1;
        this.width = 800;
        this.height = 400;

        this.$canvas = $canvas;
        this.$canvas.css("border", "1px solid black");
        this.context = this.$canvas[0].getContext('2d');

        this.$canvas[0].width = this.width;
        this.$canvas[0].height = this.height;
        this.$canvas.width(this.width * this.hwScale);
        this.$canvas.height(this.height * this.hwScale);
    },

    clear: function () {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);
    }
});