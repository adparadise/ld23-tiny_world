"use strict";

Game.Resources.Tileset = Game.Class({
    initialize: function (def) {
        this.image = new Image();
        this.image.src = def.url;
        this.tileWidth = def.tileWidth;
        this.tileHeight = def.tileHeight;
        this.width = def.width;
        this.height = def.height;
    },

    tileIDToUV: function (tileID) {
        var u = tileID % this.width;
        return {
            u: u,
            v: (tileID - u) / this.width
        }
    },

    drawTile: function (display, cell, x, y) {
        var uv = this.tileIDToUV(cell.tileID);
        display.context.drawImage(this.image, 
                                  uv.u * this.tileWidth, uv.v * this.tileHeight, 
                                  this.tileWidth, this.tileHeight,
                                  x * this.tileWidth, y * this.tileHeight,
                                  this.tileWidth, this.tileHeight);
    }
});