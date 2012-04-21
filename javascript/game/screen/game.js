

Game.Screen.Game = Game.Class({
    initialize: function () {
        this.map = new Game.Map(32, 32);
    },

    render: function (display, resources) {
        this.map.render(display, resources);
    }
});