"use strict";

Game.Resources = Game.Class({
    initialize: function (definitions) {
        this.loadResources(definitions);
    },

    loadResources: function (definitions) {
        var resources = this;
        var image;
        this.tileset = {};
        _.each(definitions, function (def, label) {
            if (def.type === "tileset") {
                resources.tileset[label] = new Game.Resources.Tileset(def);
            }
        });
    },


});