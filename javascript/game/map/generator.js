/*global Game, head, window, $, _*/
"use strict";

Game.Map.Generator = Game.Class({
    initialize: function (panelWidth, panelHeight) {
        this.panelWidth = panelWidth;
        this.panelHeight = panelHeight;
        
        this.buildFragmentPool();
        this.panelMasses = {};
        this.massInstances = [];
    },
    
    buildFragmentPool: function () {
        var i, j;
        var fragmentPoolSize = 30;
        var fragments, references;
        var poolLimit = 256;
        this.fragmentPool = [];
        for (i = fragmentPoolSize; i--;) {
            fragments = new Game.Map.Fragments(30, 40, i);
            references = fragments.getFragmentReferences();
            for (j = references.length; j--;) {
                this.fragmentPool.push(references[j]);
                if (this.fragmentPool.length >= poolLimit) {
                    break;
                }
            }
            if (this.fragmentPool.length >= poolLimit) {
                break;
            }
        }
    },

    getNewMassInstance: function () {
        var seed = this.massInstances.length;
        var rand = Game.random.get(seed + 600);
        var instance = {
            id: seed,
            reference: rand % this.fragmentPool.length,
            offset: {
                x: 0,
                y: 0
            }
        };
        this.massInstances.push(instance);
        return instance;
    },

    panelMassIndex: function (r, s) {
        return "" + r + "_" + s;
    },

    getFragmentReferenceFromMassInstance: function (massInstance) {
        return this.fragmentPool[massInstance.reference];
    },

    addMassInstance: function (massInstance, x, y) {
        var minR, maxR;
        var minS, maxS;
        var r, s;
        var panelMassIndex;
        var panelMassList;
        var fragmentReference = this.getFragmentReferenceFromMassInstance(massInstance);

        massInstance.offset.x = x;
        massInstance.offset.y = y;
        minR = Math.floor(x / this.panelWidth);
        minS = Math.floor(y / this.panelHeight);
        maxR = Math.floor((x + fragmentReference.width) / this.panelWidth);
        maxS = Math.floor((y + fragmentReference.height) / this.panelHeight);

        for (s = minS; s <= maxS; s++) {
            for (r = minR; r <= maxR; r++) {
                panelMassList = this.getPanelMasses(r, s);
                panelMassList.massInstances.push(massInstance);
            }
        }
    },

    populatePanel: function (r, s) {
        var panelMassIndex = this.panelMassIndex(r, s);
        var panelMassList = this.panelMasses[panelMassIndex];
        var massInstance = this.getNewMassInstance();
        this.addMassInstance(massInstance, r * this.panelWidth, s * this.panelHeight);
    },

    getPanelMasses: function (r, s) {
        var panelMassIndex = this.panelMassIndex(r, s);
        var panelMassList;
        if (!this.panelMasses[panelMassIndex]) {
            this.panelMasses[panelMassIndex] = {
                isComplete: false,
                massInstances: []
            };
            this.populatePanel(r, s);
        }
        panelMassList = this.panelMasses[panelMassIndex];
        return panelMassList;
    },   

    render: function (display) {
        this.fragments.render(display);
    },

    isMassPointSolid: function (massInstance, x, y) {
        var fragmentReference = this.fragmentPool[massInstance.reference];
        var massX = (x - massInstance.offset.x);
        var massY = (y - massInstance.offset.y);
        return fragmentReference.fragments.isMassPointSolid(fragmentReference.index, massX, massY);
    },

    paintToPanel: function (r, s, panel) {
        var i, j, k;
        var x, y;
        var value;
        var panelMasses = this.getPanelMasses(r, s);
        
        for (j = this.panelHeight; j--;) {
            y = s * this.panelHeight + j;
            for (i = this.panelWidth; i--;) {
                x = r * this.panelWidth + i;
                value = 0;
                for (k = panelMasses.massInstances.length; k--;) {
                    if (this.isMassPointSolid(panelMasses.massInstances[k], x, y)) {
                        value = 1;
                        break;
                    }
                }
                
                panel.cells[j][i].solid = value;
            }
        }
    }
    
});