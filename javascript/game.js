"use strict";

var Game = {
    Screen: {},
    Resources: {},

    begin: function () {
        Game.$ = jQuery;
        var $canvas = Game.$('canvas#main');
        Game.instance = new Game.Application({
            $canvas: $canvas,
            usageUrl: "http://localhost:4567"
        });
    },

    Class: function (prototype) {
        var constructor = function () {
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };
        constructor.prototype = prototype;
        return constructor;
    }
};