/*global Game, head, window, $, _*/
"use strict";

Game.Screen.Info = Game.Class({
    initialize: function () {
        this.$contents = Game.$([
            '<div class="overlay">',
            '  <h1>Even Tiny Worlds...</h1>',
            '  <p>A game by <a href="http://www.andrewparadise.com">Andrew Paradise</a></p>',
            '  <p>WASD or Arrow keys to move</p>',
            '</div>'
        ].join("\n"));
    },

    show: function (display) {
        Game.$('body').append(this.$contents);
        var $canvas = Game.$('canvas');
        var offset = $canvas.offset();
        this.$contents.css('position', 'absolute');
        this.$contents.width($canvas.width());
        this.$contents.height($canvas.height());
        this.$contents.css('left', offset.left);
        this.$contents.css('top', offset.top);
        
        this.$contents.show();
    },

    hide: function () {
        this.$contents.remove();
    }
});