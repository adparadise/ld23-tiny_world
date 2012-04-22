"use strict";

Game.Map = Game.Class({
    initialize: function (width, height, tilesetName) {
        this.width = width;
        this.height = height;
        this.tilesetName = tilesetName;

        this.mapGenerator = new Game.Map.Generator(width, height);
        this.buildCells();
        this.bakeCells();
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
        this.buildBackbuffer();
    },

    buildCells: function () {
        var x, y;
        var row;
        this.cells = [];
        for (y = 0; y < this.height; y++) {
            row = [];
            for (x = 0; x < this.width; x++) {
                row.push({
                    solid: 1
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
        var targetX, targetY;
        var targetXL, targetXR;
        var targetYL, targetYR;
        var targetSolidL, targetSolidR;
        var nudge = 0.01;
        var directionX = 1, directionY = 1;
        var cellEdgeX = 0, cellEdgeY = 0;
        if (deltaX < 0) {
            directionX = -1;
            cellEdgeX = 1;
        }
        if (deltaY < 0) {
            directionY = -1;
            cellEdgeY = 1;
        }

        targetX  = Math.floor((targetPosition.x + directionX * object.radius) / this.tileset.tileWidth);
        targetYL = Math.floor((targetPosition.y + object.radius * .7)         / this.tileset.tileHeight);
        targetYR = Math.floor((targetPosition.y - object.radius * .7)         / this.tileset.tileHeight);
        targetSolidL = this.getAttributeAt(targetX, targetYL, 'solid');
        targetSolidR = this.getAttributeAt(targetX, targetYL, 'solid');
        if (!targetSolidL || !targetSolidR) {
            targetPosition.x = ((targetX + cellEdgeX) * this.tileset.tileWidth) - 
                directionX * (object.radius + nudge);
        }

        targetXL = Math.floor((targetPosition.x + object.radius * .7)         / this.tileset.tileWidth);
        targetXR = Math.floor((targetPosition.x - object.radius * .7)         / this.tileset.tileWidth);
        targetY  = Math.floor((targetPosition.y + directionY * object.radius) / this.tileset.tileHeight);
        targetSolidL = this.getAttributeAt(targetXL, targetY, 'solid');
        targetSolidR = this.getAttributeAt(targetXR, targetY, 'solid');
        if (!targetSolidL || !targetSolidR) {
            targetPosition.y = ((targetY + cellEdgeY) * this.tileset.tileHeight) -
                directionY * (object.radius + nudge);
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

    buildBackbuffer: function () {
        this.backbuffer = new Game.Display.Backbuffer(this.width * this.tileset.tileWidth,
                                                     this.height * this.tileset.tileHeight);
        this.renderToBackbuffer();
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
        this.backbuffer.render(display, camera);
    }
});