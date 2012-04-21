"use strict";

Game.Display = Game.Class({
    initialize: function ($canvas) {
        this.scale = 2;
        this.hwScale = 2;
        this.width = 500;
        this.height = 200;

        this.$canvas = $canvas;
        this.$canvas.css("border", "1px solid black");
        this.context = this.$canvas[0].getContext('2d');

        this.$canvas[0].width = this.width;
        this.$canvas[0].height = this.height;
        this.$canvas.width(this.width * this.hwScale);
        this.$canvas.height(this.height * this.hwScale);
    }
});