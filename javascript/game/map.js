/*global Game, head, window, $, _*/
"use strict";

Game.Map = Game.Class({
    initialize: function (width, height, tilesetName) {
        this.width = width;
        this.height = height;
        this.panelWidth = 16;
        this.panelHeight = 16;
        this.panelsWide = Math.ceil(this.width / this.panelWidth);
        this.panelsHigh = Math.ceil(this.height / this.panelHeight);
        this.tilesetName = tilesetName;

        this.buildPanels();
        this.bakePanels();
    },

    buildPanels: function () {
        var i, j;
        var row;
        var offset;
        this.panels = [];
        for (j = 0; j < this.panelsHigh; j++) {
            row = [];
            for (i = 0; i < this.panelsWide; i++) {
                offset = { 
                    x: this.panelWidth * i,
                    y: this.panelHeight * j
                };
                row.push(new Game.Map.Panel(this.panelWidth, this.panelHeight, offset, this.tilesetName));
            }
            this.panels.push(row);
        }
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
        var i, j;
        var panel;
        for (j = this.panelsHigh; j--;) {
            for (i = this.panelsWide; i--;) {
                panel = this.panels[j][i];
                panel.resolveResources(resources);
                panel.buildBackbuffer();
            }
        }
    },

    bakePanels: function () {
        var i, j;
        var panel;
        for (j = this.panelsHigh; j--;) {
            for (i = this.panelsWide; i--;) {
                panel = this.panels[j][i];
                this.bakePanel(panel);
            }
        }
    },

    bakePanel: function (panel) {
        var i, j;
        var x, y;
        var cellNeighbors;
        var setName, set;
        var psuedoRandom;
        var cell;
        for (j = this.panelHeight; j--;) {
            y = panel.offset.y + j;
            for (i = this.panelWidth; i--;) {
                x = panel.offset.x + i;
                cellNeighbors = this.cellNeighbors(x, y);
                setName = Game.Constants.resourceDefinitions[this.tilesetName].rules[cellNeighbors];
                if (!setName) {
                    setName = '_blank';
                }
                set = Game.Constants.resourceDefinitions[this.tilesetName].sets[setName];
                psuedoRandom = Game.random.get(y * (this.width + 2) + x);
                cell = this.getAt(x, y);
                cell.tileID = set[psuedoRandom % set.length];
            }
        }
    },

    getAt: function (x, y) {
        var panelX, panelY;
        var panel;
        panelX = Math.floor(x / this.panelWidth);
        panelY = Math.floor(y / this.panelHeight);
        if (this.panels[panelY]) {
            panel = this.panels[panelY][panelX];
        }
        if (panel) {
            return panel.getAt(x, y);
        }
    },

    getAttributeAt: function (x, y, attribute, def) {
        var cell = this.getAt(x, y);
        if (!cell || !cell[attribute]) {
            return def;
        }
        return cell[attribute];
    },

    cellNeighbors: function (x, y, attribute) {
        var i, j;
        var neighbors = [];
        attribute = attribute || 'solid';
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
        targetYL = Math.floor((targetPosition.y + object.radius * 0.7)        / this.tileset.tileHeight);
        targetYR = Math.floor((targetPosition.y - object.radius * 0.7)        / this.tileset.tileHeight);
        targetSolidL = this.getAttributeAt(targetX, targetYL, 'solid');
        targetSolidR = this.getAttributeAt(targetX, targetYL, 'solid');
        if (!targetSolidL || !targetSolidR) {
            targetPosition.x = ((targetX + cellEdgeX) * this.tileset.tileWidth) - 
                directionX * (object.radius + nudge);
        }

        targetXL = Math.floor((targetPosition.x + object.radius * 0.7)        / this.tileset.tileWidth);
        targetXR = Math.floor((targetPosition.x - object.radius * 0.7)        / this.tileset.tileWidth);
        targetY  = Math.floor((targetPosition.y + directionY * object.radius) / this.tileset.tileHeight);
        targetSolidL = this.getAttributeAt(targetXL, targetY, 'solid');
        targetSolidR = this.getAttributeAt(targetXR, targetY, 'solid');
        if (!targetSolidL || !targetSolidR) {
            targetPosition.y = ((targetY + cellEdgeY) * this.tileset.tileHeight) -
                directionY * (object.radius + nudge);
        }
    },

    render: function (display, camera, resources) {
        var i, j;
        var panel;
        for (j = this.panelsHigh; j--;) {
            for (i = this.panelsWide; i--;) {
                panel = this.panels[j][i];
                panel.render(display, camera);
            }
        }
    }
});