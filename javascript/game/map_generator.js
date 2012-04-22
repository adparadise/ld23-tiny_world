"use strict";

Game.MapGenerator = Game.Class({
    initialize: function (width, height) {
        this.width = width;
        this.height = height;
        this.fragments = new Game.MapFragments(40, 30);
    },

    render: function (display) {
        this.fragments.render(display);
    }

    
    
});