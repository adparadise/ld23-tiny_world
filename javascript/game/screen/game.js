

Game.Screen.Game = Game.Class({
    initialize: function () {
        this.map = new Game.Map(5, 5, 'bgtiles');
        this.camera = new Game.Camera();
    },

    render: function (display, resources) {
        this.map.render(display, this.camera, resources);
    }
});