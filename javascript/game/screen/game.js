

Game.Screen.Game = Game.Class({
    initialize: function () {
        this.map = new Game.Map(32, 32);
        this.camera = new Game.Camera();
    },

    render: function (display, resources) {
        this.map.render(display, this.camera, resources);
    }
});