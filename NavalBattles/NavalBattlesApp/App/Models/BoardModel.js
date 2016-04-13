(function () {
    var ns = window.navalBattles = window.navalBattles || {};
    ns.BoardModel = function (sizeX, sizeY) {
        var _self = this;

        _self.sizeX = sizeX;
        _self.sizeY = sizeY;
        _self.ships = [];
        _self.missHits = [];

        _self.placeShip = function (ship, onSuccess, onFailure) {
            if (isShipOutOfBounds(ship)) {
                if (onFailure) onFailure();
                return;
            }

            for (var i = 0; i < _self.ships.length; i++) {
                if (areShipsColliding(_self.ships[i], ship)) {
                    if (onFailure) onFailure();
                    return;
                }
            }

            _self.ships.push(ship);
            if (onSuccess) onSuccess();
        };

        _self.isAllSunk = function () {
            for (var i = 0; i < _self.ships.length; i++) {
                if (!_self.ships[i].isSunk())
                    return false;
            }
            return true;
        };

        _self.hit = function (posX, posY, onSuccess, onFailure) {
            var success = false;
            for (var i = 0; i < _self.ships.length; i++) {
                _self.ships[i].hit(posX, posY, function () {
                    success = true;
                });
                if (success) {
                    if (onSuccess) onSuccess();
                    return;
                }
            }
            _self.missHits.push({
                posX: posX,
                posY: posY
            });
            if (onFailure) onFailure();
        };

        function isShipOutOfBounds(ship) {
            var firstAbsPos = ship.hitTargets[0].getAbsPos();
            var lastAbsPos =
                ship.hitTargets[ship.hitTargets.length - 1].getAbsPos();

            return firstAbsPos.posX < 0 || firstAbsPos.posX >= _self.sizeX
                || firstAbsPos.posY < 0 || firstAbsPos.posY >= _self.sizeY
                || lastAbsPos.posX < 0 || lastAbsPos.posX >= _self.sizeX
                || lastAbsPos.posY < 0 || lastAbsPos.posY >= _self.sizeY;
        }

        function areShipsColliding(ship1, ship2) {
            for (var i = 0; i < ship1.hitTargets.length; i++) {
                var hitTarget1 = ship1.hitTargets[i];
                for (var k = 0; k < ship2.hitTargets.length; k++) {
                    var hitTarget2 = ship2.hitTargets[k];
                    if (areHitTargetsColliding(hitTarget1, hitTarget2)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function areHitTargetsColliding(hitTarget1, hitTarget2) {
            var absPos1 = hitTarget1.getAbsPos();
            var absPos2 = hitTarget2.getAbsPos();
            return absPos1.posX == absPos2.posX
                && absPos1.posY == absPos2.posY;
        }
    };
})();
