"use strict";

Game.Resources.Spritesheet = Game.Class({
    initialize: function (name, def) {
        this.name = name;
        this.image = new Image();
        this.imageUrl = def.url;
        this.tileWidth = def.tileWidth;
        this.tileHeight = def.tileHeight;
        this.width = def.width;
        this.height = def.height;
        this.origin = {
            x: def.origin.x,
            y: def.origin.y
        };
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
        var direction = 1;
        
        display.context.drawImage(this.image, 
                                  uv.u * this.tileWidth, uv.v * this.tileHeight, 
                                  this.tileWidth, this.tileHeight,
                                  (x - camera.offset.x - this.origin.x) * display.scale, 
                                  (y - camera.offset.y - this.origin.y) * display.scale,
                                  this.tileWidth * display.scale, 
                                  this.tileHeight * display.scale);
                                  
    }
    

});