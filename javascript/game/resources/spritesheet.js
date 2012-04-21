"use strict";

Game.Resources.Spritesheet = Game.Class({
    initialize: function (def) {
        this.image = new Image();
        this.imageUrl = def.url;
        this.tileWidth = def.tileWidth;
        this.tileHeight = def.tileHeight;
        this.width = def.width;
        this.height = def.height;
    },

    load: function (callback) {
        Game.$(this.image).bind('load', callback);
        this.image.src = this.imageUrl;
    },

    spriteIDToUV: function (spriteID) {
        var u = spriteID % this.width;
        return {
            u: u,
            v: (spriteID - u) / this.width
        }
    },

    drawSprite: function (display, camera, spriteID, x, y) {
        var uv = this.spriteIDToUV(spriteID);
        display.context.drawImage(this.image, 
                                  uv.u * this.tileWidth, uv.v * this.tileHeight, 
                                  this.tileWidth, this.tileHeight,
                                  (x - camera.offset.x) * display.scale, 
                                  (y - camera.offset.y) * display.scale,
                                  this.tileWidth * display.scale, 
                                  this.tileHeight * display.scale);
                                  
    }
    

});