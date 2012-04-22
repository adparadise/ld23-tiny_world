"use strict";

Game.Display.Backbuffer = Game.Class({
    initialize: function (width, height) {
        this.width = width;
        this.height = height;

        this.$buffer = Game.$('<canvas></canvas>');
        this.$buffer[0].width = this.width;
        this.$buffer[0].height = this.height;

        this.context = this.$buffer[0].getContext('2d');

        this.scale = 1;
    },
    
    render: function (display, camera, offset) {
        offset = offset || { x: 0, y: 0 };
        display.context.drawImage(this.$buffer[0], 
                                  0, 0, this.width, this.height,
                                  (offset.x - camera.offset.x + display.width / 2) * display.scale,
                                  (offset.y - camera.offset.y + display.height / 2) * display.scale,
                                  this.width * display.scale,
                                  this.height * display.scale);
        
    }
});