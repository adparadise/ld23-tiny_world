/*global Game, head, window, $, _*/
"use strict";

Game.Resources.Tileset = Game.Class({
    initialize: function (name, def) {
        this.name = name;
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

    tileIDToUV: function (tileID) {
        var u = tileID % this.width;
        return {
            u: u,
            v: (tileID - u) / this.width
        };
    },

    drawTile: function (display, camera, cell, x, y) {
        var uv = this.tileIDToUV(cell.tileID);

        display.context.drawImage(this.image, 
                                  uv.u * this.tileWidth, uv.v * this.tileHeight, 
                                  this.tileWidth, this.tileHeight,
                                  (x * this.tileWidth - camera.offset.x) * display.scale, 
                                  (y * this.tileHeight - camera.offset.y) * display.scale,
                                  this.tileWidth * display.scale, 
                                  this.tileHeight * display.scale);

    }
});