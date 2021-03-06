"use strict";

var Game = require('../js/game');
// Supress logging
console.log = function() {}

describe("Example", function () {
    it("1 should be true", function () {
        expect(1).toBeTruthy();
    });

});

describe("Game", function () {
    beforeEach(function () {
        Game.depth = 0;
    });

    describe("#depth", function () {
        it("is 0 when did nothing", function () {
            expect(Game.depth).toEqual(0);
        });

        it("should be increased by 2 when I(I(0)) is evaluated", function () {
            Game.cI(Game.cI(Game.zero));
            expect(Game.depth).toEqual(2);
        });

        it("should be increased by 2 when K(0)(0) is evaluated", function () {
            Game.cK(Game.zero)(Game.zero);
            expect(Game.depth).toEqual(2);
        });

        it("should be increased by 4 when K(K)(0)(0)(0) is evaluated", function () {
            Game.cK(Game.cK)(Game.zero)(Game.zero)(Game.zero);
            expect(Game.depth).toEqual(4);
        });
    });

    describe("#zero", function () {
        beforeEach(function () {
            
        });

        it("should be equal to 0", function () {
            expect(Game.zero).toEqual(0);
        });
    });

    describe("succ(succ(zero))", function () {
        it("should be equal to 2", function () {
            expect(Game.succ(Game.succ(Game.zero))).toEqual(2);
        });
    });

    describe("I(zero)", function () {
        it("should be equal to 0", function () {
            expect(Game.cI(Game.zero)).toEqual(0);
        });
    });

    describe("I(inc)", function () {
        it("should be equal to inc", function () {
            expect(Game.cI(Game.inc)).toEqual(Game.inc);
        });
    });
});

describe("Game with state", function() {
    var state;

    beforeEach(function () {
        Game.depth = 0;
        state = Game.initState();
    });

    describe("when executing only initState", function() {
        it("should have correct slots", function () {
            expect(state.player[0].slot[0].vitality).toEqual(10000);
            expect(state.player[0].slot[255].vitality).toEqual(10000);
            expect(state.player[1].slot[0].vitality).toEqual(10000);
            expect(state.player[1].slot[255].vitality).toEqual(10000);
        });
    });

    describe("when executing the 1st turn of the 1st exmaple in the official site", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.zero, false, state);
            Game.step(0, Game.inc, false, state);
            expect(state.player[0].slot[0].value).toEqual(0);
            expect(state.player[0].slot[0].vitality).toEqual(10000);
            expect(state.player[1].slot[0].value).toEqual(Game.inc);
            expect(state.player[1].slot[0].vitality).toEqual(10000);
            expect(state.turn).toEqual(2);
        });
    });

    describe("when executing all the turns of the 1st exmaple in the official site", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.zero, false, state);
            Game.step(0, Game.inc, false, state);
            Game.step(0, Game.succ, true, state);
            Game.step(0, Game.zero, false, state);
            expect(state.player[0].slot[0]).toEqual({'value': 1, 'vitality': 10000});
            expect(state.player[1].slot[0]).toEqual({'value': Game.cI, 'vitality': 10001});
            Game.step(0, Game.succ, true, state);
            Game.step(0, Game.dec, false, state);
            expect(state.player[0].slot[0]).toEqual({'value': 2, 'vitality': 10000});
            expect(state.player[1].slot[0]).toEqual({'value': Game.dec, 'vitality': 10001});
            Game.step(0, Game.dbl, true, state);
            Game.step(0, Game.zero, false, state);
            expect(state.player[0].slot[0]).toEqual({'value': 4, 'vitality': 10000});
            expect(state.player[0].slot[255]).toEqual({'value': Game.cI, 'vitality': 9999});
            expect(state.player[1].slot[0]).toEqual({'value': Game.cI, 'vitality': 10001});
            Game.step(0, Game.inc, true, state);
            Game.step(0, Game.succ, true, state);
            expect(state.player[0].slot[4]).toEqual({'value': Game.cI, 'vitality': 10001});
            expect(state.player[0].slot[255]).toEqual({'value': Game.cI, 'vitality': 9999});
            expect(state.turn).toEqual(10);
        });
    });

    describe("when executing all the turns of the 2nd exmaple in the official site", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.help, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cK, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cS, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.succ, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.succ, true, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.dbl, true, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.dbl, true, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.dbl, true, state); Game.step(0, Game.cI, false, state);
            Game.step(1, Game.dbl, true, state); Game.step(0, Game.cI, false, state);
            expect(state.player[0].slot[1].value).toEqual(16);
            Game.step(0, Game.cK, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cS, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.get, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cK, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cS, true, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.succ, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            expect(state.turn).toEqual(38);
            expect(state.player[0].slot[0]).toEqual({'value': Game.cI, 'vitality': 9984});
            expect(state.player[0].slot[1]).toEqual({'value': 16, 'vitality': 10017});
        });
    });

    describe("when executing all the turns of the 3rd exmaple in the official site", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.cS, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.get, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.cI, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            expect(state.player[0].slot[0]).toEqual({'value': Game.cI, 'vitality': 10000});
        });
    });

    describe("when using K", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.cK, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            Game.step(0, Game.zero, false, state); Game.step(0, Game.cI, false, state);
            expect(state.player[0].slot[0]).toEqual({'value': 0, 'vitality': 10000});
        });
    });

});
