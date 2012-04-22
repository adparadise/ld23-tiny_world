"use strict";

Game.MapFragmentContinuities = Game.Class({
    initialize: function () {
        this.offsetMarker = 10;
        this.bounds = [];
    },

    increaseBounds: function (value, x, y) {
        var bounds;
        if (value === 1) {
            value = this.bounds.length + this.offsetMarker;
            this.bounds.push({
                value: value,
                minX: x, maxX: x,
                minY: y, maxY: y
            });
        } else {
            value = this.resolveLowest(value);
            bounds = this.bounds[value - this.offsetMarker];
            if (x < bounds.minX) {
                bounds.minX = x;
            }
            if (x > bounds.maxX) {
                bounds.maxX = x;
            }
            if (y < bounds.minY) {
                bounds.minY = y;
            }
            if (y > bounds.maxY) {
                bounds.maxY = y;
            }
        }
        return value;
    },

    // Migrate the higher number down into the lower number, and mark it inactive.
    markSame: function (valueA, valueB) {
        var lowValue, highValue;
        var lowBounds, highBounds;
        valueA = this.resolveLowest(valueA);
        if (valueA === valueB) {
            return;
        }
        
        lowValue = Math.min(valueA, valueB);
        highValue = Math.max(valueA, valueB);
        
        lowBounds = this.bounds[lowValue - this.offsetMarker];
        highBounds = this.bounds[highValue - this.offsetMarker];

        highBounds.isReplacedBy = lowValue;
        lowBounds.isReplacedBy = undefined;
        
        // Update the better bounds' limits
        this.takeBounds(lowBounds, highBounds);
    },

    takeBounds: function (lowBounds, highBounds) {
        if (highBounds.minX < lowBounds.minX) {
            lowBounds.minX = highBounds.minX;
        }
        if (highBounds.maxX > lowBounds.maxX) {
            lowBounds.maxX = highBounds.maxX;
        }
        if (highBounds.minY < lowBounds.minY) {
            lowBounds.minY = highBounds.minY;
        }
        if (highBounds.maxY > lowBounds.maxY) {
            lowBounds.maxY = highBounds.maxY;
        }
    },

    resolveLowest: function (value, readOnly) {
        var currentBounds;
        var priorBounds;
        var i;
        for (i = 100; i--;) {
            currentBounds = this.bounds[value - this.offsetMarker];
            if (!currentBounds) {
                break;
            }
            if (currentBounds.isReplacedBy) {
                value = currentBounds.isReplacedBy;
                priorBounds = currentBounds;
            }
        }
        return value;
    },

    finalize: function (cells, width, height) {
        var continuities = this;
        var value, resolvedValue
        var x, y;
        var keepers = {};
        for (y = height; y--;) {
            for (x = width; x--;) {
                value = cells[y][x];
                if (value >= this.offsetMarker) {
                    resolvedValue = this.resolveLowest(value);
                    if (resolvedValue !== value) {
                        cells[y][x] = resolvedValue;
                    }
                    keepers[resolvedValue] = true;
                }
            }
        }
        this.masses = [];
        _.each(keepers, function (truth, value) {
            var bounds = continuities.bounds[value - continuities.offsetMarker];
            var area = (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
            if (area > 10) {
                continuities.masses.push(bounds);
            }
        });
    },

    render: function (display, offset, size) {
        var i;
        var bounds;
        for (i = this.masses.length; i--;) {
            bounds = this.masses[i];
            if (!bounds.isReplacedBy) {
                display.context.strokeStyle = "#f80";
                display.context.strokeRect(bounds.minX * size + offset.x, 
                                           bounds.minY * size + offset.y,
                                           (bounds.maxX - bounds.minX + 1) * size, 
                                           (bounds.maxY - bounds.minY + 1) * size);
            }
            
        }
    }


    
});