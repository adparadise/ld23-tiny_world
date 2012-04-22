/*global Game, head, window, $, _*/
"use strict";

Game.Map.Generator = Game.Class({
    initialize: function (width, height) {
        this.width = width;
        this.height = height;
        this.fragments = new Game.Map.Fragments(40, 30);
    },

    render: function (display) {
        this.fragments.render(display);
    }

    
    
});