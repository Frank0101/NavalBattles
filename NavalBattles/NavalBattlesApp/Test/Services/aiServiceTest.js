/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../../Scripts/angular.min.js" />
/// <reference path="../../../Scripts/angular-mocks.js" />
/// <reference path="../../App/navalBattles.js" />

describe("AI Service Test", function () {
    var ns = window.navalBattles;
    var board = null;

    beforeEach(function () {
        board = new ns.BoardModel(12, 14);
    });

    describe("When the service is created", function () {
        var target;

        beforeEach(function () {
            module("navalBattlesApp.services");

            inject(function ($injector) {
                target = $injector.get("aiService");
            });
        });

        it("It should hit and call the callback", function () {
            var callbackCalled = false;

            target.hit(board, function () {
                callbackCalled = true;
            });

            expect(board.missHits.length).toBe(1);
            expect(callbackCalled).toBeTruthy();
        });

        it("It shouldn't hit the same position twice", function () {
            for (var i = 0; i < 100; i++) {
                target.hit(board);

                var lastMissHit = board.missHits[board.missHits.length - 1];
                for (var n = 0; n < board.missHits.length - 1; n++) {
                    var currentMissHit = board.missHits[n];
                    expect(lastMissHit.posX != currentMissHit.posX
                        || lastMissHit.posY != currentMissHit.posY).toBeTruthy();
                }
            }
            expect(board.missHits.length).toBe(100);
        });

        describe("When a hit point is present", function () {
            beforeEach(function () {
                board.placeShip(new ns.ShipModel(4, 3, 1, true));
                board.hit(4, 3);
            });

            it("It should hit around the point", function () {
                target.hit(board);
                target.hit(board);
                target.hit(board);
                target.hit(board);

                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 3 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 5 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 4 && missHit.posY == 2;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 4 && missHit.posY == 4;
                }).length == 1).toBeTruthy();
            });
        });

        describe("When a hit line is present", function () {
            beforeEach(function () {
                board.placeShip(new ns.ShipModel(4, 3, 2, true));
                board.hit(4, 3);
                board.hit(5, 3);
            });

            it("It should hit along the line", function () {
                target.hit(board);
                target.hit(board);

                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 3 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 6 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
            });
        });

        describe("When a hit corner is present", function () {
            beforeEach(function () {
                board.placeShip(new ns.ShipModel(4, 3, 2, true));
                board.placeShip(new ns.ShipModel(4, 4, 1, true));
                board.hit(4, 3);
                board.hit(5, 3);
                board.hit(4, 4);
            });

            it("It should hit along the corner", function () {
                target.hit(board);
                target.hit(board);
                target.hit(board);
                target.hit(board);

                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 3 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 6 && missHit.posY == 3;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 4 && missHit.posY == 2;
                }).length == 1).toBeTruthy();
                expect(board.missHits.filter(function (missHit) {
                    return missHit.posX == 4 && missHit.posY == 5;
                }).length == 1).toBeTruthy();
            });
        });
    });
});
