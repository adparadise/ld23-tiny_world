/*global Game, head, window, $, _*/
"use strict";

Game.Map = Game.Class({
    initialize: function (width, height, tilesetName) {
        this.panelWidth = 16;
        this.panelHeight = 16;
        this.tilesetName = tilesetName;

        this.generator = new Game.Map.Generator(this.panelWidth, this.panelHeight);
        this.panels = {};
    },

    panelIndex: function (r, s) {
        return "" + r + "_" + s;
    },

    buildPanel: function (r, s) {
        var panelIndex = this.panelIndex(r, s);
        var offset = {
            x: this.panelWidth * r,
            y: this.panelHeight * s
        };
        var panel = new Game.Map.Panel(this.panelWidth, this.panelHeight, offset, this.tilesetName);
        this.panels[panelIndex] = panel;
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
    },

    getPanel: function (r, s) {
        var panelIndex = this.panelIndex(r, s);
        if (!this.panels[panelIndex]) {
            this.buildPanel(r, s);
        }
        return this.panels[panelIndex];
    },

    getPanelForRendering: function (r, s) {
        var panel = this.getPanel(r, s);
        if (!panel.isBaked) {
            this.bakePanel(panel);
            panel.resolveResources(Game.instance.resources);
        }
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
                psuedoRandom = Game.random.get(y * (this.panelWidth + 2) + x);
                cell = this.getAt(x, y);
                cell.tileID = set[psuedoRandom % set.length];
            }
        }
        panel.isBaked = true;
    },

    getAt: function (x, y) {
        var r, s;
        var panel;
        r = Math.floor(x / this.panelWidth);
        s = Math.floor(y / this.panelHeight);
        panel = this.getPanel(r, s);
        return panel.getAt(x, y);
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
        this.getPanelForRendering(0, 0);
    }
});