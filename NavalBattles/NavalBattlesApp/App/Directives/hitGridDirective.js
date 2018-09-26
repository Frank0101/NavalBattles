angular.module("navalBattlesApp.directives").directive("hitGridDirective", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            board: "=",
            onCellSelect: "&"
        },
        templateUrl: "/NavalBattlesApp/App/Views/hitGridDirective.html",
        controller: ["$scope", function ($scope) {
            $scope.range = function (size) {
                var range = new Array(size);
                for (var i = 0; i < range.length; i++) {
                    range[i] = i;
                }
                return range;
            };

            $scope.selectCell = function (row, col) {
                $scope.board.hit(col, row);
                if ($scope.onCellSelect) $scope.onCellSelect();
            };
        }]
    };
});
