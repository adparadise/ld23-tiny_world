"use strict";

Game.Input = Game.Class({
    initialize: function () {
        this.keydown = this.eventCallback('keydown');
        this.keyup = this.eventCallback('keyup');
        this.bind();
        this.buttonState = {};
        this.events = [];
    },

    bind: function () {
        Game.$(document).bind('keydown', this.keydown);
        Game.$(document).bind('keyup', this.keyup);
    },

    keydown: function (event) {
        if (this.isWatchedKey(event.keyCode)) {
            this.events.push({
                keyCode: event.keyCode,
                action: 'down'
            });
        }
    },
    
    keyup: function (event) {
        if (this.isWatchedKey(event.keyCode)) {
            this.events.push({
                keyCode: event.keyCode,
                action: 'up'
            });
        }
    },

    isWatchedKey: function (keyCode) {
        if (keyCode >= 37 && keyCode <= 41) {
            return true;
        }
    },

    exclusivePairsOf: function (keyCode) {
        switch (keyCode) {
        case 37:
            return ['right'];
        case 38:
            return ['down'];
        case 39:
            return ['left'];
        case 40:
            return ['up'];
        };
    },

    keyCodeToSymbol: function (keyCode) {
        switch (keyCode) {
        case 37:
            return 'left';
        case 38:
            return 'up';
        case 39:
            return 'right';
        case 40:
            return 'down';
        };
    },

    step: function () {
        var input = this;
        _.each(this.events, function (event) {
            var symbol = input.keyCodeToSymbol(event.keyCode);
            var pairs = input.exclusivePairsOf(event.keyCode);
            var newState = false;
            if (event.action === 'down') {
                newState = true;
            }
            input.buttonState[symbol] = newState;
            if (newState && pairs) {
                _.each(pairs, function (pairSymbol) {
                    input.buttonState[pairSymbol] = false;
                });
            }
        });
        this.events = [];
    }
});