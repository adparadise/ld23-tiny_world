

Game.Screen.Gameplay = Game.Class({
    initialize: function () {
        var enemy;
        this.physicsCollection = new Game.Physics.Collection();
        this.map = new Game.Map(32, 32, 'bgtiles');
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
    },

    step: function (timeDelta, frameNumber, input) {
        var i;
        this.player.step(timeDelta, frameNumber, input);
        for (i = this.enemies.length; i--;) {
            this.enemies[i].step(timeDelta, frameNumber, this.player);
        }

        this.physicsCollection.resolveVelocities(timeDelta);

        this.player.resolveState(frameNumber);
        for (i = this.enemies.length; i--;) {
            this.enemies[i].resolveState(frameNumber);
        }
    },

    render: function (display, resources, frameNumber) {
        var i;
        var isPlayerRendered;
        this.map.render(display, this.camera, resources, frameNumber);
        this.enemies.sort(function(a, b) {
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