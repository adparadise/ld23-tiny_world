"use strict";

Game.Application = Game.Class({
    initialize: function (options) {
        // Initialize variables
        this.display = new Game.Display(options.$canvas);
        this.resources = new Game.Resources();
        this.usage = new Game.Usage(options.usageUrl);
        this.input = new Game.Input();

        // Start resource loading
        this.resources.loadResources(Game.Constants.resourceDefinitions, 
                                     this.eventCallback('ready'));

        // Prepare a screen
        this.screen = new Game.Screen.Game();

        // Report that we've begun.
        this.usage.report({event:"start"});
    },

    ready: function () {
        this.start();
    },

    start: function () {
        var application = this;
        var renderCallback = function () {
            application.render();
            window.requestAnimationFrame(renderCallback);
        }
        window.requestAnimationFrame(renderCallback);
        this.stepInterval = setInterval(this.eventCallback('step'), 1000 / Game.Constants.worldRate);
    },

    step: function () {
        this.input.step();
        this.screen.step(1000 / Game.Constants.worldRate, this.input);
    },

    render: function () {
        this.display.clear();
        this.screen.render(this.display, this.resources);
    }
});