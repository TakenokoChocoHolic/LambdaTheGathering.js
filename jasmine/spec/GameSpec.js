var Game;

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

        it("should increase by 1 when 'zero' has been called", function () {
            Game.zero();
            expect(Game.depth).toEqual(1);
        });
    });

    describe("#zero", function () {
        beforeEach(function () {
            
        });

        it("should be equal to 0", function () {
            expect(Game.zero()).toEqual(0);
        });
    });

    describe("succ(succ(zero))", function () {
        it("should be equal to 2", function () {
            expect(Game.succ(Game.succ(Game.zero()))).toEqual(2);
        });
    });

    describe("I(zero)", function () {
        it("should be equal to 0", function () {
            expect(Game.cI(Game.zero)).toEqual(0);
        });
    });
});

describe("Game with state", function() {
    var state;

    beforeEach(function () {
        Game.depth = 0;
        state = Game.initState();
    });

    describe("when executing the 1st turn of the 1st exmaple actions in the official site", function() {
        it("should have correct slots", function () {
            Game.step(0, Game.zero, false, state);
            Game.step(0, Game.inc, false, state);
            exepct(state.player[0].slot[0].value).toEqual(0);
            exepct(state.player[0].slot[0].vitality).toEqual(10000);
            exepct(state.player[1].slot[0].value).toEqual(Game.inc);
            exepct(state.player[1].slot[0].vitality).toEqual(10000);
        });
    });
});
