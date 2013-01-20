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

        it("should be increased by 2 when I(I(0)) is evaluated", function () {
            Game.cI(Game.cI(Game.zero));
            expect(Game.depth).toEqual(2);
        });

        it("should be increased by 2 when K(0)(0) is evaluated", function () {
            Game.cK(Game.zero)(Game.zero);
            expect(Game.depth).toEqual(2);
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

});
