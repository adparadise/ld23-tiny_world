/*global Game, head, window, $, _*/
"use strict";

Game.Map = Game.Class({
    initialize: function (tilesetName) {
        this.panelWidth = 16;
        this.panelHeight = 16;
        this.tilesetName = tilesetName;

        this.generator = new Game.Map.Generator(this.panelWidth, this.panelHeight);
        this.panels = {};
        this.cameraPanel = {
            r: 0,
            s: 0
        };
    },

    findClearingCoords: function (r, s) {
        var panel = this.getPanelForRendering(r, s);
        var coords = panel.findClearingCoords();
        if (coords) {
            return {
                x: (coords.x + .5) * this.tileset.tileWidth,
                y: (coords.y + .5) * this.tileset.tileHeight,
            }
        }
    },

    leadPlayerInClearing: function (player) {
        var i;
        var x = Math.floor(player.position.x / this.tileset.tileWidth);
        var y = Math.floor(player.position.y / this.tileset.tileHeight);
        var r = Math.floor(x / this.panelWidth);
        var s = Math.floor(y / this.panelHeight);
        var deltaX, deltaY;
        var coords;

        deltaX = 0;
        if (player.velocity.x > 0) {
            deltaX = 1;
        } else if (player.velocity.x < 0) {
            deltaX = -1;
        }
        deltaY = 0;
        if (player.velocity.y > 0) {
            deltaY = 1;
        } else if (player.velocity.y < 0) {
            deltaY = -1;
        }

        for (i = 2; i < 4; i++) {
            coords = this.findClearingCoords(r + i * deltaX - deltaY, s + i * deltaY + deltaX);
            if (coords) {
                break;
            }
        }
        return coords;
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
        var panel = new Game.Map.Panel(this.panelWidth, this.panelHeight, offset, panelIndex, this.tilesetName);
        this.generator.paintToPanel(r, s, panel);
        
        this.panels[panelIndex] = panel;
    },

    resolveResources: function (resources) {
        this.tileset = resources.tileset[this.tilesetName];
    },

    getPanel: function (r, s, optional) {
        var panelIndex = this.panelIndex(r, s);
        if (!this.panels[panelIndex] && !optional) {
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
        return panel;
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
                cell.neighborClass = cellNeighbors;
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

    recentlyRendered: function (panel) {
        if (!this._recentlyRendered) {
            this._recentlyRendered = {};
        }
        if (!this._nextRecentIndex) {
            this._nextRecentIndex = 1;
        }
        this._recentlyRendered[panel.panelIndex] = this._nextRecentIndex;
    },

    releaseOldPanels: function () {
        var map = this;
        var toRelease = [];
        var i, panelIndex, panel;
        if (!this._releaseAttempts) {
            this._releaseAttempts = 50;

            // increment our own clock of age
            if (!this._nextRecentIndex) {
                this._nextRecentIndex = 1;
            }
            this._nextRecentIndex += 1;

            // Look for panels to release
            _.each(this._recentlyRendered, function (recentIndex, panelIndex) {
                if (recentIndex < map._nextRecentIndex - 10) {
                    toRelease.push(panelIndex);
                }
            });
            
            // release them
            for (i = toRelease.length; i--;) {
                panelIndex = toRelease[i];
                delete this._recentlyRendered[panelIndex];
                panel = this.panels[panelIndex];
                if (panel) {
                    panel.releaseBackbuffer();
                }
            }

        } else {
            this._releaseAttempts -= 1;
        }
    },

    render: function (display, camera, resources) {
        var minR, maxR;
        var minS, maxS;
        var r, s;
        var panelWidth = this.tileset.tileWidth * this.panelWidth;
        var panelHeight = this.tileset.tileHeight * this.panelHeight;
        
        minR = Math.floor((camera.offset.x -  display.width / 2) / panelWidth);
        maxR = Math.ceil((camera.offset.x +  display.width / 2) / panelWidth);
        minS = Math.floor((camera.offset.y - display.height / 2) / panelHeight);
        maxS = Math.ceil((camera.offset.y + display.height / 2) / panelHeight);

        this.cameraPanel.r = Math.floor(camera.offset.x / panelWidth);
        this.cameraPanel.s = Math.floor(camera.offset.y / panelHeight);

        for (s = minS; s < maxS; s++) {
            for (r = minR; r < maxR; r++) {
                var panel = this.getPanelForRendering(r, s);
                panel.render(display, camera, resources);
                this.recentlyRendered(panel);
            }
        }
        this.releaseOldPanels();
    }
});