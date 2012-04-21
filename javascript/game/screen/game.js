

Game.Screen.Game = Game.Class({
    initialize: function () {
        this.map = new Game.Map(Game.Constants.maps.map1[0].length, 
                                Game.Constants.maps.map1.length, 'bgtiles');
        this.camera = new Game.Camera();
    },

    step: function (timeDelta, input) {
        this.camera.step(timeDelta, input);
    },

    render: function (display, resources) {
        this.map.render(display, this.camera, resources);
    }
});