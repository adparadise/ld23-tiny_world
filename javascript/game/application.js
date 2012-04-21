"use strict";

Game.Application = Game.Class({
    initialize: function (options) {
        this.display = new Game.Display(options.$canvas);
        this.resources = new Game.Resources(Game.Constants.resourceDefinitions);

        this.screen = new Game.Screen.Game();
        setTimeout(function () {
            var app = Game.instance;
            app.screen.render(app.display, app.resources);
        }, 300);

        this.usage = new Game.Usage(options.usageUrl);
        this.usage.report({event:"start"});
    }
});