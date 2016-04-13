angular.module("navalBattlesApp.directives").directive("boardDirective", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            board: "=",
            showShips: "="
        },
        templateUrl: "/NavalBattlesApp/App/Views/boardDirective.html",
        controller: ["$scope", function ($scope) {
            $scope.range = function (size) {
                var range = new Array(size);
                for (var i = 0; i < range.length; i++) {
                    range[i] = i;
                }
                return range;
            };
        }]
    };
});
