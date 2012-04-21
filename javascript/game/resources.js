"use strict";

Game.Resources = Game.Class({
    initialize: function () {

    },

    loadResources: function (definitions, completeCallback) {
        var resources = this;
        var resource;
        this.completeCallback = completeCallback;
        this.tileset = {};
        this.pendingResourceCount = 0;
        _.each(definitions, function (def, label) {
            if (def.type === "tileset") {
                resource = new Game.Resources.Tileset(def);
                resource.load(resources.eventCallback('resourceComplete', resource));
                resources.tileset[label] = resource;
                resources.pendingResourceCount += 1;
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