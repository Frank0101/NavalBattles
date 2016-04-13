(function () {
    var ns = window.navalBattles = window.navalBattles || {};
    ns.HitTargetModel = function (ship, relPos) {
        var _self = this;

        _self.ship = ship;
        _self.relPos = relPos;
        _self.isHit = false;

        _self.getAbsPos = function () {
            if (_self.ship.isHorizontal) {
                return {
                    posX: _self.ship.posX + relPos,
                    posY: _self.ship.posY
                };
            } else {
                return {
                    posX: _self.ship.posX,
                    posY: _self.ship.posY + relPos
                };
            }
        };

        _self.hit = function (posX, posY, onSuccess, onFailure) {
            var absPos = _self.getAbsPos();
            if (absPos.posX == posX && absPos.posY == posY) {
                _self.isHit = true;
                if (onSuccess) onSuccess();
            } else {
                if (onFailure) onFailure();
            }
        };
    };
})();
