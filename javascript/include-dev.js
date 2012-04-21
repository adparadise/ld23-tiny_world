"use strict";

head.js(
    "javascript/game.js",
    function () {
        head.js(
            "javascript/game/application.js",
            "javascript/game/screen.js",
            function () {
                Game.begin();
            }
        )
    }
);