/// <reference path="../../../Scripts/jquery-2.2.2.min.js" />
/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../../Scripts/angular.min.js" />
/// <reference path="../../../Scripts/angular-mocks.js" />
/// <reference path="../angularTestUtils.js" />
/// <reference path="../../App/navalBattles.js" />

describe("Board Directive Test", function () {
    var ns = window.navalBattles;
    var board = null;

    beforeEach(function () {
        board = new ns.BoardModel(12, 14);
        board.placeShip(new ns.ShipModel(1, 1, 2, true));
        board.placeShip(new ns.ShipModel(1, 3, 3, true));
        board.placeShip(new ns.ShipModel(1, 5, 4, true));
        board.placeShip(new ns.ShipModel(1, 7, 5, true));
        board.placeShip(new ns.ShipModel(1, 9, 6, true));
        board.placeShip(new ns.ShipModel(8, 1, 2, false));
        board.placeShip(new ns.ShipModel(8, 4, 3, false));
        board.placeShip(new ns.ShipModel(10, 1, 4, false));
        board.hit(0, 0);
        board.hit(1, 1);
    });

    describe("When the directive is compiled with showShips = true", function () {
        var $scope, target;

        beforeEach(function () {
            initDirective(
                "navalBattlesApp.directives",
                "/NavalBattlesApp/App/Views/boardDirective.html",
                "../../App/Views/boardDirective.html",
                "<board-directive board='board' show-ships='true'></board-directive>",
                function ($s) {
                    $scope = $s;
                    $scope.board = board;
                },
                function (t) {
                    target = t;
                });
        });

        it("It should display the board", function () {
            checkBoard(target);
        });

        it("It should display the ships", function () {
            var shipElems = target.find(".ships .ship");
            expect(shipElems.length).toBe(board.ships.length);

            for (var i = 0; i < shipElems.length; i++) {
                var shipElem = $(shipElems[i]);
                var ship = board.ships[i];
                expect(shipElem.hasClass("pos-x-" + ship.posX)).toBeTruthy();
                expect(shipElem.hasClass("pos-y-" + ship.posY)).toBeTruthy();
                expect(shipElem.hasClass("size-" + ship.size)).toBeTruthy();
            }
        });

        it("It should display the hits", function () {
            checkHits(target);
        });

        it("It should display the miss hits", function () {
            checkMissHits(target);
        });
    });

    describe("When the directive is compiled with showShips = false", function () {
        var $scope, target;

        beforeEach(function () {
            initDirective(
                "navalBattlesApp.directives",
                "/NavalBattlesApp/App/Views/boardDirective.html",
                "../../App/Views/boardDirective.html",
                "<board-directive board='board' show-ships='false'></board-directive>",
                function ($s) {
                    $scope = $s;
                    $scope.board = board;
                },
                function (t) {
                    target = t;
                });
        });

        it("It should display the board", function () {
            checkBoard(target);
        });

        it("It shouldn't display the ships", function () {
            var shipElems = target.find(".ships .ship");
            expect(shipElems.length).toBe(0);
        });

        it("It should display the hits", function () {
            checkHits(target);
        });

        it("It should display the miss hits", function () {
            checkMissHits(target);
        });
    });

    function checkBoard(target) {
        var boardElem = target.find(".board");
        expect(boardElem.length).toBe(1);
        expect(boardElem.hasClass("size-x-" + board.sizeX)).toBeTruthy();
        expect(boardElem.hasClass("size-y-" + board.sizeY)).toBeTruthy();

        var rowElems = boardElem.find(".row");
        expect(rowElems.length).toBe(board.sizeY);

        for (var i = 0; i < rowElems.length; i++) {
            var colElems = $(rowElems[i]).find(".col");
            expect(colElems.length).toBe(board.sizeX);
        }
    }

    function checkHits(target) {
        var shipHitsElems = target.find(".hits .ship-hits");

        var shipHitsElemsIndex = 0;
        for (var i = 0; i < board.ships.length; i++) {
            var ship = board.ships[i];
            if (ship.isHit()) {
                var shipHitsElem = $(shipHitsElems[shipHitsElemsIndex++]);
                var hitElems = shipHitsElem.find(".hit");

                var hitElemsIndex = 0;
                for (var k = 0; k < ship.hitTargets.length; k++) {
                    var hitTarget = ship.hitTargets[k];
                    if (hitTarget.isHit) {
                        var hitElem = $(hitElems[hitElemsIndex++]);
                        expect(hitElem.hasClass("pos-x-" + hitTarget.getAbsPos().posX)).toBeTruthy();
                        expect(hitElem.hasClass("pos-y-" + hitTarget.getAbsPos().posY)).toBeTruthy();
                    }
                }
                expect(hitElems.length).toBe(hitElemsIndex);
            }
        }
        expect(shipHitsElems.length).toBe(shipHitsElemsIndex);
    }

    function checkMissHits(target) {
        var missHitElems = target.find(".miss-hits .miss-hit");
        expect(missHitElems.length).toBe(board.missHits.length);

        for (var i = 0; i < missHitElems.length; i++) {
            var missHitElem = $(missHitElems[i]);
            var missHit = board.missHits[i];
            expect(missHitElem.hasClass("pos-x-" + missHit.posX)).toBeTruthy();
            expect(missHitElem.hasClass("pos-y-" + missHit.posY)).toBeTruthy();
        }
    }
});
