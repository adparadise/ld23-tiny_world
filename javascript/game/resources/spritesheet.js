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

    drawSprite: function (display, camera, spriteID, x, y, span) {
        var uv = this.spriteIDToUV(spriteID);
        var direction = 1;
        var spanOffset;
        span = span || 1;

        
        spanOffset = this.tileWidth * (span - 1) / 2;
        display.context.drawImage(this.image, 
                                  uv.u * this.tileWidth, uv.v * this.tileHeight, 
                                  this.tileWidth * span, this.tileHeight,
                                  (x - camera.offset.x - this.origin.x - spanOffset + display.width / 2) * display.scale, 
                                  (y - camera.offset.y - this.origin.y + display.height / 2) * display.scale,
                                  this.tileWidth * span * display.scale, 
                                  this.tileHeight * display.scale);
                                  
    }
    

});