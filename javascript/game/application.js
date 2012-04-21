"use strict";

Game.Application = Game.Class({
    initialize: function (options) {
        this.screen = new Game.Screen(options.$canvas);
        this.usage = new Game.Usage(options.usageUrl);

        this.usage.report({event:"start"});
    }
});