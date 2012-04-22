/*global Game, head, window, $, _*/
"use strict";

Game.Map.FragmentReference = Game.Class({
    initialize: function (fragments, index) {
        var mass = fragments.continuities.masses[index];

        this.fragments = fragments;
        this.index = index;
        this.width = mass.maxX - mass.minX;
        this.height = mass.maxY - mass.minY;
    }
});