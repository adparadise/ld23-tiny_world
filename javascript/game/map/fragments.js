/*global Game, head, window, $, _*/
"use strict";

Game.Map.Fragments = Game.Class({
    initialize: function (width, height, seed) {
        this.width = width;
        this.height = height;
        if (!seed) {
            if (!Game.Map.Fragments._seed) {
                Game.Map.Fragments._seed = 0;
            }
            Game.Map.Fragments._seed += 1;
            seed = Game.Map.Fragments._seed;
        }
        this.border = 2;
        this.seed = seed;

        this.generate();
        this.findContinuities();
        this.clean();
    },

    clean: function () {
        this.fixed = undefined;
    },

    generate: function () {
        var fragments = this;
        this.fixed = this.seedCells(256 * 0.03);
        this.cells = this.seedCells(128);
        
        this.apply(function (x, y) { 
            return fragments.filledCount(x, y) < 5 ? 1 : 0; 
        });
        this.apply(function (x, y) { 
            return fragments.filledCount(x, y) < 5 ? 1 : 0; 
        });
        this.apply(function (x, y) { 
            return fragments.filledCount(x, y) < 5 ? 1 : 0; 
        });
        this.apply(function (x, y) { 
            return fragments.filledCount(x, y) < 5 ? 1 : 0; 
        });
    },

    findContinuities: function () {
        var fragments = this;
        this.continuities = new Game.Map.Continuities();

        this.overwrite(function (x, y) {
            var self, south, east;
            var highValue, lowValue;
            self = fragments.cellValue(x, y);
            if (!self) {
                return 0;
            }
            south = fragments.cellValue(x, y + 1);
            east = fragments.cellValue(x + 1, y);
            highValue = Math.max(south, east);
            lowValue = Math.min(south, east);
            if (lowValue > 1) {
                self = lowValue;
            } else if (highValue > 1) {
                self = highValue;
            }
            self = fragments.continuities.increaseBounds(self, x, y);
            
            if (highValue > 1) {
                fragments.continuities.markSame(highValue, self);
            }
            
            return self;
        });
        
        this.continuities.finalize(this.cells, this.width, this.height);
    },

    overwrite: function (operation) {
        var x, y;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                this.cells[y][x] = operation(x, y);
            }
        }
    },
    
    apply: function (operation) {
        var x, y;
        var clone = [];
        var row, value;
        for (y = this.height; y--;) {
            row = [];
            for (x = this.width; x--;) {
                row.push(operation(x, y));
            }
            clone.push(row);
        }
        this.cells = clone;
    },
    
    cellValue: function (x, y) {
        if (x < 0 || x >= this.width ||
            y < 0 || y >= this.height) {
            return 0;
        }
            
        return this.cells[y][x];
    },

    isFilled: function (x, y) {
        if (x < 0 || x >= this.width ||
            y < 0 || y >= this.height) {
            return 0;
        }
            
        return this.fixed[y][x] || this.cells[y][x];
    },

    filledCount: function (x, y) {
        var i, j;
        var filledCount = 0;
        for (j = -1; j <= 1; j++) {
            for (i = -1; i <= 1; i++) {
                if (this.isFilled(x + i, y + j)) {
                    filledCount += 1;
                }
            }
        }
        return filledCount;
    },

    seedCells: function (threshold) {
        var x, y, i;
        var cells = [];
        var rand;
        var row, value;
        for (y = this.height; y--;) {
            row = [];
            for (x = this.width; x--;) {
                value = 0;
                if (x >= this.border && x < this.width - this.border &&
                    y >= this.border && y < this.height - this.border) {
                    rand = Game.random.get(y * this.width + x + this.seed);
                    if (rand < threshold) {
                        value = 1;
                    }
                }

                row.push(value);
            }
            cells.push(row);
        }
        return cells;
    },

    getFragmentReferences: function () {
        var references = [];
        var reference;
        var i;
        for (i = this.continuities.masses.length; i--;) {
            reference = new Game.Map.FragmentReference(this, i);
            references.push(reference);
        }

        return references;
    },

    render: function (display) {
        var x, y;
        var size = 8;
        var offset = {
            x: 60,
            y: 40
        };
        var isFixed, isFilled;
        var color;
        var i, bounds;
        for (y = this.height; y--;) {
            for (x = this.width; x--;) {
                isFixed = this.fixed[y][x];
                isFilled = this.cells[y][x];
                color = "#448";
                if (isFilled) {
                    color = "#" + (isFilled * 5).toString(16) + "0";
                }
                display.context.fillStyle = color;
                display.context.fillRect(x * size + offset.x, y * size + offset.y, size, size);
            }
        }
   
        this.continuities.render(display, offset, size);
    }
});