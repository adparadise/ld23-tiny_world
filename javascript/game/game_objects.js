"use strict";

Game.GameObjects = Game.Class({
    initialize: function () {
        this.objects = [];
    },

    add: function (object) {
        this.objects.push(object);
    },

    obstructedPosition: function (character) {
        var position =
        _.each(this.objects, function () {
            
        });
    }
});