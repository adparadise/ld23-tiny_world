/*global Game, head, window, $, _*/
"use strict";

Game.Screen.Gameplay = Game.Class({
    initialize: function () {
        var enemy;
        this.physicsCollection = new Game.Physics.Collection();
        this.map = new Game.Map('bgtiles');
        this.player = new Game.Characters.Player();

        this.infoScreen = new Game.Screen.Info();
        this.deathScreen = new Game.Screen.Death();
       
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
        this.enemyWarpCount = 0;
    },

    resolveResources: function (resources) {
        this.map.resolveResources(resources);
        this.positionCharacters();
        this.infoScreen.show();
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

        for (r = 0; r < 3; r++) {
            clearingCoords = this.map.findClearingCoords(clearingR, r);
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

        this.teleportEnemies(frameNumber);

        if (input.everPressed) {
            this.infoScreen.hide();
        }
        if (this.player.isDead && input.buttonState.space) {
            this.deathScreen.hide();
            Game.restart();
        }
    },

    teleportEnemies: function (frameNumber) {
        var i;
        var distance;
        var enemy;
        var coords;
        if (!this._lastTeleport) {
            this._lastTeleport = 1;
        }
        for (i = this.enemies.length; i--;) {
            enemy = this.enemies[i];
            distance = Math.sqrt(Math.pow(enemy.position.x - this.player.position.x, 2) +
                                 Math.pow(enemy.position.y - this.player.position.y, 2));
            if (distance > 700 && 
                (this.player.velocity.x !== 0 || this.player.velocity.y !== 0) &&
                this._lastTeleport < frameNumber - 120) {

                coords = this.map.leadPlayerInClearing(this.player);
                if (coords) {
                    this._lastTeleport = frameNumber;
                    enemy.position.x = coords.x;
                    enemy.position.y = coords.y;
                    this.enemyWarpCount += 1;
                    break;
                }
            }
        }
    },

    enemyDistance: function (enemyID) {
        var enemy = this.enemies[enemyID];
        var distance = Math.sqrt(Math.pow(this.player.position.x - enemy.position.x, 2) +
                                 Math.pow(this.player.position.y - enemy.position.y, 2));
        return distance;
    },

    checkForDeath: function () {
        var i;
        var enemy;
        var distance;
        for (i = this.enemies.length; i--;) {
            enemy = this.enemies[i];
            distance = this.enemyDistance(i);
            if (distance < enemy.radius + this.player.radius && !this.player.isDead) {
                this.player.wasKilled();
                this.deathScreen.show();
                this.sendUsageReport('death');
                break;
            }
        }
    },

    sendUsageReport: function (event) {
        var usageReport = {
            event: event,
            frameNumber: Game.instance.frameNumber,
            enemyWarpCount: this.enemyWarpCount,
            totalPanelCount: this.map.totalPanelCount,
            bakedPanelCount: this.map.bakedPanelCount,
            cameraPanel: this.map.panelIndex(this.map.cameraPanel.r,
                                             this.map.cameraPanel.s),
            enemy0Distance: Math.floor(this.enemyDistance(0)),
            enemy1Distance: Math.floor(this.enemyDistance(1)),
        };
        Game.instance.usage.report(usageReport);
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