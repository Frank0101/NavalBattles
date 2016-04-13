/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../../Scripts/angular.min.js" />
/// <reference path="../../../Scripts/angular-mocks.js" />
/// <reference path="../../App/navalBattles.js" />

describe("Placing Service Test", function () {
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
                target = $injector.get("placingService");
            });
        });

        it("It should place the ships into a board", function () {
            target.placeShips(board, [2, 2, 3, 3, 4, 4, 5, 6]);

            expect(board.ships.length).toBe(8);
            expect(board.ships[0].size).toBe(2);
            expect(board.ships[1].size).toBe(2);
            expect(board.ships[2].size).toBe(3);
            expect(board.ships[3].size).toBe(3);
            expect(board.ships[4].size).toBe(4);
            expect(board.ships[5].size).toBe(4);
            expect(board.ships[6].size).toBe(5);
            expect(board.ships[7].size).toBe(6);
        });
    });
});
