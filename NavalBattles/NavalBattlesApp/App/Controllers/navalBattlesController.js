angular.module("navalBattlesApp.controllers").controller("navalBattlesController",
    ["$scope", "placingService", "aiService", function ($scope, placingService, aiService) {
        var ns = window.navalBattles;

        $scope.init = function () {
            $scope.playerBoard = new ns.BoardModel(12, 12);
            placingService.placeShips($scope.playerBoard, [2, 2, 3, 3, 4, 4, 5, 6]);

            $scope.enemyBoard = new ns.BoardModel(12, 12);
            placingService.placeShips($scope.enemyBoard, [2, 2, 3, 3, 4, 4, 5, 6]);

            $scope.isPlayerTurn = true;
        };

        $scope.$watch("isPlayerTurn", function (value) {
            if (!value) {
                aiService.hit($scope.playerBoard, $scope.endEnemyTurn);
            }
        });

        $scope.endPlayerTurn = function () {
            $scope.isPlayerTurn = false;
        };

        $scope.endEnemyTurn = function () {
            $scope.isPlayerTurn = true;
        };

        $scope.playerWins = function () {
            return $scope.enemyBoard.isAllSunk();
        };

        $scope.enemyWins = function () {
            return $scope.playerBoard.isAllSunk();
        };

        $scope.isEndGame = function () {
            return $scope.playerWins() || $scope.enemyWins();
        };

        $scope.init();
    }]);
