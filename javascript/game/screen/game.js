

Game.Screen.Game = Game.Class({
    initialize: function () {
        this.map = new Game.Map(Game.Constants.maps.map1[0].length, 
                                Game.Constants.maps.map1.length, 'bgtiles');
        this.player = new Game.Characters.Player();
        this.camera = new Game.Camera();
    },

    step: function (timeDelta, frameNumber, input) {
        this.player.step(timeDelta, frameNumber, input);
    },

    render: function (display, resources, frameNumber) {
        this.map.render(display, this.camera, resources, frameNumber);
        this.player.render(display, this.camera, resources, frameNumber);
    }
});