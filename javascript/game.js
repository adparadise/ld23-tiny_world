/*global Game, head, window, $, _*/
"use strict";

var Game = {
    Screen: {},
    Resources: {},
    Characters: {},
    Physics: {},

    begin: function () {
        Game.$ = jQuery;
        var $canvas = Game.$('canvas#main');
        Game.random = new Game.Random();
        Game.instance = new Game.Application({
            $canvas: $canvas,
            usageUrl: "http://localhost:4567"
        });
    },

    Class: function (prototype) {
        var liveConstructor;
        var baseObject = this.getBaseObject(this.BaseClassPrototype);
        _.extend(baseObject, prototype);
        
        liveConstructor = function () {
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        };
        liveConstructor.prototype = baseObject;
        

        return liveConstructor;
    },

    getBaseObject: function (prototype) {
        var baseObject;
        var inertConstructor = function () { };
        inertConstructor.prototype = prototype;

        baseObject = new inertConstructor();
        return baseObject;
    },
    
    BaseClassPrototype: {
        eventCallback: function (methodName) {
            var curriedArgs = [].slice.apply(arguments).slice(1);
            var bindArgs = [this[methodName], this].concat(curriedArgs);
            return _.bind.apply(_, bindArgs);
        }
    }
};