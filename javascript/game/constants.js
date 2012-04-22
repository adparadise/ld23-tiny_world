"use strict";

Game.Constants = {
    worldRate: 60,
    resourceDefinitions: {
        bgtiles: {
            type: "tileset",
            url: "images/bgtiles.png",
            tileWidth: 24,
            tileHeight: 16,
            width: 10,
            height: 10,
            sets: {
                solid:      [31,32,41,42,  21,21,21,21],
                leftEdge:   [35,45,25,55],
                rightEdge:  [34,44,24,54],
                topEdge:    [61,62,60,60],
                bottomEdge: [64,65,63,63],
                blCorner: [47],
                brCorner: [48],
                tlCorner: [37],
                trCorner: [38],
                _blank: [12]
            },
            rules: {
                'e_n_s_self_w': 'solid',
                'n_s_self_w': 'rightEdge',
                'e_n_s_self': 'leftEdge',
                'e_s_self_w': 'topEdge',
                'e_n_self_w': 'bottomEdge',
                'e_n_self': 'blCorner',
                'n_self_w': 'brCorner',
                'e_s_self': 'tlCorner',
                's_self_w': 'trCorner'
            }
        },
        player: {
            type: "spritesheet",
            url: "images/player.png",
            tileWidth: 32,
            tileHeight: 48,
            width: 10,
            height: 10,
            origin: {
                x: 16,
                y: 40
            },
            sets: {
                stand: [23],
                walkLeft: [24,25,26,27,28,29],
                walkRight: [38,37,36,35,34,33],
                dead: [43]
            }
        },
        enemy: {
            type: "spritesheet",
            url: "images/globe_4up.png",
            tileWidth: 282,
            tileHeight: 282,
            width: 2,
            height: 2,
            origin: {
                x: 141,
                y: 266
            },
            sets: {
                roll: [0,1,2,3]
            }
        }
    },
}