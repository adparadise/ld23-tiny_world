"use strict";

Game.Constants = {
    resourceDefinitions: {
        bgtiles: {
            type: "tileset",
            url: "images/bgtiles.png",
            tileWidth: 24,
            tileHeight: 16,
            width: 10,
            height: 10,
            sets: {
                solid: [31,32,41,42],
                leftEdge: [35,45],
                rightEdge: [34,44],
                topEdge: [61,62],
                bottomEdge: [64,65],
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
    },
    maps: {
        map1: [[0,0,0,0,0],
               [0,1,1,1,0],
               [0,1,1,1,0],
               [0,1,1,1,0],
               [0,0,0,0,0]]
    }
}