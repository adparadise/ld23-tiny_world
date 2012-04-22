

Game.Screen.Gameplay = Game.Class({
    initialize: function () {
        this.physicsCollection = new Game.Physics.Collection();
        this.map = new Game.Map(16, 16, 'bgtiles');
        this.player = new Game.Characters.Player();
        this.physicsCollection.addStatic(this.map);
        this.physicsCollection.addObject(this.player);
        this.camera = new Game.Camera();
    },

    resolveResources: function (resources) {
        this.map.resolveResources(resources);
    },

    step: function (timeDelta, frameNumber, input) {
        this.player.step(timeDelta, frameNumber, input);
        this.physicsCollection.resolveVelocities(timeDelta);

        this.player.resolveState(frameNumber);
    },

    render: function (display, resources, frameNumber) {
        this.map.render(display, this.camera, resources, frameNumber);
        this.player.render(display, this.camera, resources, frameNumber);
    }
});