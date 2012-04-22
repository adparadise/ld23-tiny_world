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
        return instance;
    },

    panelMassIndex: function (r, s) {
        return "" + r + "_" + s;
    },

    populatePanel: function (r, s) {
        var panelMassIndex = this.panelMassIndex(r, s);
        var panelMassList = this.panelMasses[panelMassIndex];
        var massInstance = this.getNewMassInstance();
        massInstance.offset.x = r * this.panelWidth;
        massInstance.offset.y = s * this.panelHeight;

        panelMassList.massInstances.push(massInstance);
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

    getSolids: function (r, s) {
        var panelMasses = this.getPanelMasses(r, s);
        var solids = [];
        var row;
        var i, j;
        for (j = this.panelHeight; j--;) {
            row = [];
            for (i = this.panelWidth; i--;) {
                row.push((j * (this.panelWidth + 1) + i) % 2);
            }
            solids.push(row);
        }
        return solids;
    }
    
});