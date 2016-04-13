/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../App/Models/BoardModel.js"/>
/// <reference path="../../App/Models/ShipModel.js"/>
/// <reference path="../../App/Models/HitTargetModel.js"/>

describe("Board Model Test", function () {
    var ns = window.navalBattles;
    var board = null;

    beforeEach(function () {
        board = new ns.BoardModel(10, 10);
    });

    it("It should be created", function () {
        expect(board).not.toBeNull();
    });

    it("It should have the desired size", function () {
        expect(board.sizeX).toBe(10);
        expect(board.sizeY).toBe(10);
    });

    it("It should be possible to place a ship", function () {
        var success = null;
        var ship = new ns.ShipModel(2, 3, 4, true);
        board.placeShip(ship, function () {
            success = true;
        });

        expect(success).toBeTruthy();
        expect(board.ships.length).toBe(1);
        expect(board.ships[0]).toBe(ship);
    });

    it("It shouldn't be possible to place an out-of-bounds ship", function () {
        var success = null;
        board.placeShip(new ns.ShipModel(-1, 3, 4, true),
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeFalsy();
        expect(board.ships.length).toBe(0);

        board.placeShip(new ns.ShipModel(7, 3, 4, true),
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeFalsy();
        expect(board.ships.length).toBe(0);

        board.placeShip(new ns.ShipModel(2, -1, 4, false),
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeFalsy();
        expect(board.ships.length).toBe(0);

        board.placeShip(new ns.ShipModel(2, 7, 4, false),
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeFalsy();
        expect(board.ships.length).toBe(0);
    });

    describe("When a ship has been placed", function () {
        var ship;

        beforeEach(function () {
            ship = new ns.ShipModel(2, 3, 4, true);
            board.placeShip(ship);
        });

        it("It shouldn't be possible to place a colliding ship", function () {
            var success = null;
            board.placeShip(new ns.ShipModel(0, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(1, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(2, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(3, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(4, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(5, 3, 4, true),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(2, 3, 4, false),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(3, 2, 4, false),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(4, 1, 4, false),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);

            board.placeShip(new ns.ShipModel(5, 0, 4, false),
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeFalsy();
            expect(board.ships.length).toBe(1);
        });

        it("It should be possible to hit the ship", function () {
            var success = null;
            board.hit(2, 3, function () {
                success = true;
            });

            expect(success).toBeTruthy();
            expect(ship.isHit()).toBeTruthy();
            expect(board.missHits.length).toBe(0);
        });

        it("It should be possible to miss the ship", function () {
            var failure = null;
            board.hit(2, 4, null, function () {
                failure = true;
            });

            expect(failure).toBeTruthy();
            expect(ship.isHit()).toBeFalsy();
            expect(board.missHits.length).toBe(1);
            expect(board.missHits[0].posX).toBe(2);
            expect(board.missHits[0].posY).toBe(4);
        });

        it("It should be possible to sink all the ships", function () {
            var success = null;
            board.hit(2, 3,
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeTruthy();
            expect(board.isAllSunk()).toBeFalsy();

            board.hit(3, 3,
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeTruthy();
            expect(board.isAllSunk()).toBeFalsy();

            board.hit(4, 3,
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeTruthy();
            expect(board.isAllSunk()).toBeFalsy();

            board.hit(5, 3,
                function () { success = true; },
                function () { success = false; });

            expect(success).toBeTruthy();
            expect(board.isAllSunk()).toBeTruthy();
        });
    });
});
