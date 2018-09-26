angular.module("navalBattlesApp.services").service("placingService", [function () {
    var ns = window.navalBattles;
    var _self = this;

    _self.placeShips = function (board, shipSizes) {
        for (var i = 0; i < shipSizes.length; i++) {
            var shipSize = shipSizes[i];
            var success = false;

            while (success == false) {
                var isHorizontal = Math.floor(Math.random() * 2) == 0;
                var posX, posY;
                if (isHorizontal) {
                    posX = Math.floor(Math.random() * (board.sizeX - shipSize + 1));
                    posY = Math.floor(Math.random() * (board.sizeY));
                } else {
                    posX = Math.floor(Math.random() * (board.sizeX));
                    posY = Math.floor(Math.random() * (board.sizeY - shipSize + 1));
                }
                var ship = new ns.ShipModel(posX, posY, shipSize, isHorizontal);
                board.placeShip(ship,
                    function () { success = true; },
                    function () { success = false; });
            }
        }
    };
}]);
