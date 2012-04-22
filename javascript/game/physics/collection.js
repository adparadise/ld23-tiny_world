/*global Game, head, window, $, _*/
"use strict";

Game.Physics.Collection = Game.Class({
    initialize: function () {
        this.objects = [];
        this.statics = [];
    },

    addStatic: function (object) {
        this.statics.push(object);
    },

    addObject: function (object) {
        this.objects.push(object);
    },

    resolveVelocities: function (timeDelta) {
        var collection = this;
        var targetPosition = { x: 0, y: 0 };
        _.each(this.objects, function (object) {
            if (object.velocity) {
                targetPosition.x = object.position.x + object.velocity.x * timeDelta / 1000;
                targetPosition.y = object.position.y + object.velocity.y * timeDelta / 1000;
                _.each(collection.statics, function (staticObject) {
                    staticObject.resolveObstructions(object, targetPosition);
                });
                object.velocity.x = Math.min((targetPosition.x - object.position.x) * 1000 / timeDelta,
                                             object.SPEED_X);
                object.velocity.y = Math.min((targetPosition.y - object.position.y) * 1000 / timeDelta,
                                             object.SPEED_Y);
                object.position.x = targetPosition.x;
                object.position.y = targetPosition.y;
            }
        });
    }
});