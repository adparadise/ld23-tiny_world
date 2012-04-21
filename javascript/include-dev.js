"use strict";

head.js(
    "javascript/game.js",
    function () {
        head.js(
            "javascript/game/usage.js",
            "javascript/game/application.js",
            "javascript/game/display.js",
            "javascript/game/map.js",
            "javascript/game/constants.js",
            "javascript/game/resources.js",
            "javascript/game/resources/tileset.js",
            "javascript/game/screen/game.js",
            function () {
                Game.begin();
            }
        )
    }
);