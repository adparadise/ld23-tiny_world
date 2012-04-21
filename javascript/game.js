"use strict";

var Game = {
    begin: function () {
        Game.$ = jQuery;
        var $canvas = Game.$('canvas#main');
        Game.instance = new Game.Application($canvas);
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