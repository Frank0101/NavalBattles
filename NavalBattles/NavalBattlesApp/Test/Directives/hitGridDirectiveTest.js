/// <reference path="../../../Scripts/jquery-2.2.2.min.js" />
/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../../Scripts/angular.min.js" />
/// <reference path="../../../Scripts/angular-mocks.js" />
/// <reference path="../angularTestUtils.js" />
/// <reference path="../../App/navalBattles.js" />

describe("Hit Grid Directive Test", function () {
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
    });

    describe("When the directive is compiled", function () {
        var $scope, target;
        var callbackCalled;

        beforeEach(function () {
            callbackCalled = false;

            initDirective(
                "navalBattlesApp.directives",
                "/NavalBattlesApp/App/Views/hitGridDirective.html",
                "../../App/Views/hitGridDirective.html",
                "<hit-grid-directive board='board' on-cell-select='callback()'>"
                    + "</hit-grid-directive>",
                function ($s) {
                    $scope = $s;
                    $scope.board = board;
                    $scope.callback = function () {
                        callbackCalled = true;
                    };
                },
                function (t) {
                    target = t;
                });
        });

        it("It should display the hit grid", function () {
            var hitGridElem = target.find(".hit-grid");
            expect(hitGridElem.length).toBe(1);
            expect(hitGridElem.hasClass("size-x-" + board.sizeX)).toBeTruthy();
            expect(hitGridElem.hasClass("size-y-" + board.sizeY)).toBeTruthy();

            var rowElems = hitGridElem.find(".row");
            expect(rowElems.length).toBe(board.sizeY);

            for (var i = 0; i < rowElems.length; i++) {
                var colElems = $(rowElems[i]).find(".col");
                expect(colElems.length).toBe(board.sizeX);
            }
        });

        it("It should be possible to select a cell", function () {
            expect($scope.board.missHits.length).toBe(0);
            expect(callbackCalled).toBeFalsy();

            var cell = target.find(".hit-grid .row .col");
            $(cell[1]).triggerHandler("click");

            expect($scope.board.missHits.length).toBe(1);
            expect($scope.board.missHits[0].posX).toBe(1);
            expect($scope.board.missHits[0].posY).toBe(0);
            expect(callbackCalled).toBeTruthy();
        });
    });
});
