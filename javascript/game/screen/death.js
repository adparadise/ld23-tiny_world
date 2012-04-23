/*global Game, head, window, $, _*/
"use strict";

Game.Screen.Death = Game.Class({
    initialize: function () {
        this.$contents = Game.$([
            '<div class="overlay right">',
            '  <p>Even Tiny Worlds... by <a href="http://www.andrewparadise.com">Andrew Paradise</a></p>',
            '  <p>press R to restart.</p>',
            '</div>'
        ].join("\n"));
    },
    
    show: function () {
        var $canvas = Game.$('canvas');
        var offset = $canvas.offset();
        this.$contents.css('position', 'absolute');
        this.$contents.width($canvas.width() - 80);
        this.$contents.css('left', offset.left);
        this.$contents.css('top', offset.top + 250);
        
        Game.$('body').append(this.$contents);
    },

    hide: function () {
        this.$contents.remove();
    }
});



