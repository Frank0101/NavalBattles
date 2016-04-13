/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../../Scripts/angular.min.js" />
/// <reference path="../../../Scripts/angular-mocks.js" />
/// <reference path="../../App/navalBattles.js" />

describe("Naval Battles Controller Test", function () {
    var ns = window.navalBattles;
    var playerShip = null,
        enemyShip = null;

    beforeEach(function () {
        playerShip = new ns.ShipModel(3, 3, 4, true);
        enemyShip = new ns.ShipModel(3, 3, 4, false);
    });

    describe("When the controller is created", function () {
        var $scope, target;

        var placingServiceMock = {
            placeShips: function (board) {
                if (board == $scope.playerBoard) {
                    board.placeShip(playerShip);
                } else {
                    board.placeShip(enemyShip);
                }
            }
        };

        var aiServiceMock = {
            hit: function (board, onFinish) {
                board.hit(1, 0);
                onFinish();
            }
        };

        beforeEach(function () {
            module("navalBattlesApp.controllers");

            inject(function ($controller, $rootScope) {
                $scope = $rootScope.$new();

                spyOn(placingServiceMock, "placeShips").and.callThrough();
                spyOn(aiServiceMock, "hit").and.callThrough();

                target = $controller("navalBattlesController", {
                    "$scope": $scope,
                    "placingService": placingServiceMock,
                    "aiService": aiServiceMock
                });
            });
        });

        it("It should have a board for the player", function () {
            expect($scope.playerBoard).toBeDefined();
            expect(placingServiceMock.placeShips).toHaveBeenCalledWith($scope.playerBoard, jasmine.any(Array));
            expect($scope.playerBoard.ships.length).toBe(1);
            expect($scope.playerBoard.ships[0]).toBe(playerShip);
        });

        it("It should have a board for the enemy", function () {
            expect($scope.enemyBoard).toBeDefined();
            expect(placingServiceMock.placeShips).toHaveBeenCalledWith($scope.enemyBoard, jasmine.any(Array));
            expect($scope.enemyBoard.ships.length).toBe(1);
            expect($scope.enemyBoard.ships[0]).toBe(enemyShip);
        });

        it("It should be possible to end a player's turn", function () {
            expect($scope.isPlayerTurn).toBeTruthy();

            $scope.endPlayerTurn();

            expect($scope.isPlayerTurn).toBeFalsy();
        });

        it("It should be possible to end an enemy's turn", function () {
            $scope.endPlayerTurn();
            $scope.endEnemyTurn();

            expect($scope.isPlayerTurn).toBeTruthy();

        });

        it("It should generate the enemy's move at enemy's turn", function () {
            $scope.endPlayerTurn();

            //$digest is required in order to trigger the
            //$watch defined for the isPlayerTurn variable
            $scope.$digest();

            expect(aiServiceMock.hit).toHaveBeenCalledWith($scope.playerBoard, $scope.endEnemyTurn);
            expect($scope.playerBoard.missHits.length).toBe(1);
            expect($scope.playerBoard.missHits[0].posX).toBe(1);
            expect($scope.playerBoard.missHits[0].posY).toBe(0);
            expect($scope.isPlayerTurn).toBeTruthy();
        });

        it("It should be possible to end the game with the player who wins", function () {
            expect($scope.playerWins()).toBeFalsy();
            expect($scope.enemyWins()).toBeFalsy();
            expect($scope.isEndGame()).toBeFalsy();

            $scope.enemyBoard.hit(3, 3);
            $scope.enemyBoard.hit(3, 4);
            $scope.enemyBoard.hit(3, 5);
            $scope.enemyBoard.hit(3, 6);

            expect($scope.playerWins()).toBeTruthy();
            expect($scope.enemyWins()).toBeFalsy();
            expect($scope.isEndGame()).toBeTruthy();
        });

        it("It should be possible to end the game with the enemy who wins", function () {
            expect($scope.playerWins()).toBeFalsy();
            expect($scope.enemyWins()).toBeFalsy();
            expect($scope.isEndGame()).toBeFalsy();

            $scope.playerBoard.hit(3, 3);
            $scope.playerBoard.hit(4, 3);
            $scope.playerBoard.hit(5, 3);
            $scope.playerBoard.hit(6, 3);

            expect($scope.playerWins()).toBeFalsy();
            expect($scope.enemyWins()).toBeTruthy();
            expect($scope.isEndGame()).toBeTruthy();
        });
    });
});
