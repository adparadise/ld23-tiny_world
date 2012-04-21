"use strict";

Game.Map = Game.Class({
    initialize: function (width, height) {
        this.width = width;
        this.height = height;

        this.buildCells();
    },

    buildCells: function () {
        var x, y;
        var row;
        this.cells = [];
        for (y = this.height; y--;) {
            row = [];
            for (x = this.width; x--;) {
                row.push({
                    tileID: 42
                });
            }
            this.cells.push(row);
        }
    },

    render: function (display, camera, resources) {
        var x, y;
        var cell;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                cell = this.cells[y][x];
                resources.tileset['bgtiles'].drawTile(display, camera, cell, x, y);
            }
        }
    },
});