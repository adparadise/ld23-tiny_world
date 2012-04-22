/*global Game, head, window, $, _*/
"use strict";

Game.Screen.Gameplay = Game.Class({
    initialize: function () {
        var enemy;
        this.physicsCollection = new Game.Physics.Collection();
        this.map = new Game.Map('bgtiles');
        this.player = new Game.Characters.Player();
       
        this.physicsCollection.addStatic(this.map);
        this.physicsCollection.addObject(this.player);
        this.camera = new Game.Camera();
        this.enemies = [];
        
        enemy = new Game.Characters.Enemy({x: 500, y: 300});
        this.enemies.push(enemy);
        this.physicsCollection.addObject(enemy);

        enemy = new Game.Characters.Enemy({x: 400, y: 200});
        this.enemies.push(enemy);
        this.physicsCollection.addObject(enemy);
    },

    resolveResources: function (resources) {
        this.map.resolveResources(resources);
        this.positionCharacters();
    },

    positionCharacters: function () {
        var r;
        var clearingCoords;
        var clearingR;
        for (r = 0; r < 3; r++) {
            clearingCoords = this.map.findClearingCoords(r, 0);
            if (clearingCoords) {
                clearingR = r;
                this.player.position.x = clearingCoords.x;
                this.player.position.y = clearingCoords.y;
                this.camera.offset.x = clearingCoords.x;
                this.camera.offset.y = clearingCoords.y;
                break;
            }
        }
        
        for (r = -1; r > -3; r--) {
            clearingCoords = this.map.findClearingCoords(clearingR + r, 0);
            if (clearingCoords) {
                this.enemies[0].position.x = clearingCoords.x;
                this.enemies[0].position.y = clearingCoords.y;
            }
        }

        for (r = 1; r < 3; r++) {
            clearingCoords = this.map.findClearingCoords(clearingR + r, 0);
            if (clearingCoords) {
                this.enemies[1].position.x = clearingCoords.x;
                this.enemies[1].position.y = clearingCoords.y;
            }
        }
    },


    step: function (timeDelta, frameNumber, input) {
        var i;
        this.player.step(timeDelta, frameNumber, input);
        for (i = this.enemies.length; i--;) {
            this.enemies[i].step(timeDelta, frameNumber, this.player);
        }

        this.physicsCollection.resolveVelocities(timeDelta);
        this.checkForDeath();

        this.player.resolveState(frameNumber);
        for (i = this.enemies.length; i--;) {
            this.enemies[i].resolveState(frameNumber);
        }

        this.camera.offset.x = this.player.position.x;
        this.camera.offset.y = this.player.position.y;
    },

    checkForDeath: function () {
        var i;
        var enemy;
        var distance;
        for (i = this.enemies.length; i--;) {
            enemy = this.enemies[i];
            distance = Math.sqrt(Math.pow(this.player.position.x - enemy.position.x, 2) +
                                 Math.pow(this.player.position.y - enemy.position.y, 2));
            if (distance < enemy.radius + this.player.radius) {
                this.player.wasKilled();
                break;
            }
        }
    },

    render: function (display, resources, frameNumber) {
        var i;
        var isPlayerRendered;
        this.map.render(display, this.camera, resources, frameNumber);
        this.enemies.sort(function (a, b) {
            if (a.position.y < b.position.y) {
                return 1;
            } else if (a.position.y > b.position.y) {
                return -1;
            }
        });
        
        isPlayerRendered = false;
        for (i = this.enemies.length; i--;) {
            if (this.player.position.y < this.enemies[i].position.y && !isPlayerRendered) {
                this.player.render(display, this.camera, resources, frameNumber);
                isPlayerRendered = true;
            }
            this.enemies[i].render(display, this.camera, resources, frameNumber);
        }
        if (!isPlayerRendered) {
            this.player.render(display, this.camera, resources, frameNumber);
        }
    }
});