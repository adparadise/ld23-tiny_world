"use strict";

head.js(
    "javascript/game.js",
    function () {
        head.js(
            "javascript/game/application.js",
            "javascript/game/camera.js",
            "javascript/game/constants.js",
            "javascript/game/display.js",
            "javascript/game/input.js",
            "javascript/game/map.js",
            "javascript/game/map_generator.js",
            "javascript/game/map_fragments.js",
            "javascript/game/map_fragment_continuities.js",
            "javascript/game/random.js",
            "javascript/game/resources.js",
            "javascript/game/usage.js",

            "javascript/game/characters/player.js",

            "javascript/game/resources/tileset.js",
            "javascript/game/resources/spritesheet.js",

            "javascript/game/physics/collection.js",
            
            "javascript/game/screen/gameplay.js",
            function () {
                Game.begin();
            }
        )
    }
);