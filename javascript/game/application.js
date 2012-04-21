"use strict";

Game.Application = Game.Class({
    initialize: function (options) {
        this.display = new Game.Display(options.$canvas);
        this.resources = new Game.Resources();

        this.screen = new Game.Screen.Game();
        this.usage = new Game.Usage(options.usageUrl);
        this.usage.report({event:"start"});

        this.resources.loadResources(Game.Constants.resourceDefinitions, 
                                     this.eventCallback('ready'));
    },

    ready: function () {
        this.screen.render(this.display, this.resources);
    }
});