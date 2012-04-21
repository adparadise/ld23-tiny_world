"use strict";

Game.Map = Game.Class({
    initialize: function (width, height, tilesetName) {
        this.width = width;
        this.height = height;
        this.tilesetName = tilesetName;

        this.buildCells();
        this.bakeCells();
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
    },

    buildCells: function () {
        var x, y;
        var row;
        this.cells = [];
        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
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
        var psuedoRandom;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                cellNeighbors = this.cellNeighbors(x, y);
                setName = Game.Constants.resourceDefinitions[this.tilesetName].rules[cellNeighbors];
                if (!setName) {
                    setName = '_blank';
                }
                set = Game.Constants.resourceDefinitions[this.tilesetName].sets[setName];
                psuedoRandom = Game.random.get(y * (this.width + 2) + x);
                this.cells[y][x].tileID = set[psuedoRandom % set.length];
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

    cellAtPosition: function (position) {
        
    },

    resolveObstructions: function (object, targetPosition) {
        var deltaX = targetPosition.x - object.position.x;
        var deltaY = targetPosition.y - object.position.y;
        var targetX, targetY, targetSolid;
        var nudge = 0.01;

        if (deltaX < 0) {
            targetX = Math.floor((targetPosition.x - object.radius) / this.tileset.tileWidth);
            targetY = Math.floor((targetPosition.y) / this.tileset.tileHeight);
            targetSolid = this.getAttributeAt(targetX, targetY, 'solid');
            if (!targetSolid) {
                targetPosition.x = ((targetX + 1) * this.tileset.tileWidth) + object.radius + nudge;
            }
        }
        if (deltaX > 0) {
            targetX = Math.floor((targetPosition.x + object.radius) / this.tileset.tileWidth);
            targetY = Math.floor((targetPosition.y) / this.tileset.tileHeight);
            targetSolid = this.getAttributeAt(targetX, targetY, 'solid');
            if (!targetSolid) {
                targetPosition.x = (targetX * this.tileset.tileWidth) - object.radius - nudge;
            }
        }

        if (deltaY < 0) {
            targetX = Math.floor((targetPosition.x) / this.tileset.tileWidth);
            targetY = Math.floor((targetPosition.y - object.radius) / this.tileset.tileHeight);
            targetSolid = this.getAttributeAt(targetX, targetY, 'solid');
            if (!targetSolid) {
                targetPosition.y = ((targetY + 1) * this.tileset.tileHeight) + object.radius + nudge;
            }
        }
        if (deltaY > 0) {
            targetX = Math.floor((targetPosition.x) / this.tileset.tileWidth);
            targetY = Math.floor((targetPosition.y + object.radius) / this.tileset.tileHeight);
            targetSolid = this.getAttributeAt(targetX, targetY, 'solid');
            if (!targetSolid) {
                targetPosition.y = (targetY * this.tileset.tileHeight) - object.radius - nudge;
            }
        }
        
    },

    cellNeighbors: function (x, y, attribute) {
        var i, j;
        var neighbors = [];
        attribute = attribute || 'solid'
        if (this.getAttributeAt(x, y, attribute)) {
            neighbors.push('self');
        }
        if (this.getAttributeAt(x + 1, y, attribute)) {
            neighbors.push('e');
        }
        if (this.getAttributeAt(x - 1, y, attribute)) {
            neighbors.push('w');
        }
        if (this.getAttributeAt(x, y + 1, attribute)) {
            neighbors.push('s');
        }
        if (this.getAttributeAt(x, y - 1, attribute)) {
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
                this.tileset.drawTile(display, camera, cell, x, y);
            }
        }
    }
});