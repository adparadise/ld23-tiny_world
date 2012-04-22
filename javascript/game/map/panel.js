/*global Game, head, window, $, _*/
"use strict";

Game.Map.Panel = Game.Class({
    initialize: function (width, height, offset, panelIndex, tilesetName) {
        this.panelIndex = panelIndex;
        this.width = width;
        this.height = height;
        this.tilesetName = tilesetName;
        this.offset = offset;
        this.buildCells();
    },

    buildCells: function () {
        var x, y;
        var row;
        this.cells = [];
        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
                row.push({
                    solid: (y * (this.width + 1) + x) % 5
                });
            }
            this.cells.push(row);
        }
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
        this.buildBackbuffer();
    },

    getAttributeAt: function (x, y, attribute, def) {
        var cell = this.getAt(x - this.offset.x, y - this.offset.y);
        if (!cell || !cell[attribute]) {
            return def;
        }
        return cell[attribute];
    },

    getAt: function (x, y) {
        if (this.cells[y - this.offset.y]) {
            return this.cells[y - this.offset.y][x - this.offset.x];
        }
    },

    buildBackbuffer: function () {
        this.backbuffer = new Game.Display.Backbuffer(this.width * this.tileset.tileWidth,
                                                      this.height * this.tileset.tileHeight);
        this.claimBackbuffer();
    },

    claimBackbuffer: function () {
        if (!this.backbuffer.isClaimed()) {
            this.backbuffer.claim();
            this.renderToBackbuffer();
        }
    },

    releaseBackbuffer: function () {
        if (this.backbuffer.isClaimed()) {
            this.backbuffer.release();
        }
    },

    renderToBackbuffer: function () {
        var x, y;
        var cell;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                cell = this.cells[y][x];
                this.tileset.drawTile(this.backbuffer, {offset: { x: 0, y: 0 }}, cell, x, y);
            }
        }
    },

    render: function (display, camera, resources) {
        this.claimBackbuffer();
        this.backbuffer.render(display, camera, {
            x: this.offset.x * this.tileset.tileWidth,
            y: this.offset.y * this.tileset.tileHeight
        });
    }

});
