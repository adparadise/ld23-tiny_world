/*global Game, head, window, $, _*/
"use strict";

Game.Resources = Game.Class({
    initialize: function () {

    },

    loadResources: function (definitions, completeCallback) {
        var resources = this;
        var resource;
        this.completeCallback = completeCallback;
        this.tileset = {};
        this.spritesheet = {};

        this.pendingResourceCount = 0;
        _.each(definitions, function (def, label) {
            switch (def.type) {
            case "tileset":
                resource = new Game.Resources.Tileset(label, def);
                resource.load(resources.eventCallback('resourceComplete', resource));
                resources.tileset[label] = resource;
                resources.pendingResourceCount += 1;
                break;
            case "spritesheet":
                resource = new Game.Resources.Spritesheet(label, def);
                resource.load(resources.eventCallback('resourceComplete', resource));
                resources.spritesheet[label] = resource;
                resources.pendingResourceCount += 1;
                break;
            }
        });
    },
    
    resourceComplete: function (resource, event) {
        this.pendingResourceCount -= 1;
        if (this.pendingResourceCount === 0) {
            if (this.completeCallback) {
                this.completeCallback();
            }
        }
    }

});