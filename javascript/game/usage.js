/*global Game, head, window, $, _*/
"use strict";

Game.Usage = Game.Class({
    initialize: function (url) {
        this.url = url;
    },

    report: function (values) {
        var message = _.map(values, function (value, key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }).join("&");
        Game.$.ajax({
            url: this.url + "?" + message
        });
    }
});