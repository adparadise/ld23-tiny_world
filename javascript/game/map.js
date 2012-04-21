"use strict";

Game.Map = Game.Class({
    initialize: function (width, height, tilesetName) {
        this.width = width;
        this.height = height;
        this.tilesetName = tilesetName;

        this.buildCells();
        this.bakeCells();
    },

    buildCells: function () {
        var x, y;
        var row;
        this.cells = [];
        for (y = this.height; y--;) {
            row = [];
            for (x = this.width; x--;) {
                row.push({
                    solid: Game.Constants.maps.map1[y][x]
                });
            }
            this.cells.push(row);
        }
    },

    bakeCells: function () {
        var x, y;
        var cellNeighbors;
        var setName;
        var set;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                cellNeighbors = this.cellNeighbors(x, y);
                setName = Game.Constants.resourceDefinitions[this.tilesetName].rules[cellNeighbors];
                if (!setName) {
                    setName = '_blank';
                }
                set = Game.Constants.resourceDefinitions[this.tilesetName].sets[setName];
                this.cells[y][x].tileID = set[(y * this.width + x) % set.length]
            }
        }        
    },

    getAttributeAt: function (x, y, attribute, def) {
        var cell = this.getAt(x, y);
        if (!cell || !cell[attribute]) {
            return def;
        }
        return cell[attribute];
    },

    getAt: function (x, y) {
        if (this.cells[y]) {
            return this.cells[y][x];
        }
    },

    cellNeighbors: function (x, y) {
        var i, j;
        var neighbors = [];
        if (this.getAttributeAt(x, y, 'solid')) {
            neighbors.push('self');
        }
        if (this.getAttributeAt(x + 1, y, 'solid')) {
            neighbors.push('e');
        }
        if (this.getAttributeAt(x - 1, y, 'solid')) {
            neighbors.push('w');
        }
        if (this.getAttributeAt(x, y + 1, 'solid')) {
            neighbors.push('s');
        }
        if (this.getAttributeAt(x, y - 1, 'solid')) {
            neighbors.push('n');
        }
        return neighbors.sort().join("_");
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