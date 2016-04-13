(function () {
    var ns = window.navalBattles = window.navalBattles || {};
    ns.ShipModel = function (posX, posY, size, isHorizontal) {
        var _self = this;

        _self.posX = posX;
        _self.posY = posY;
        _self.size = size;
        _self.isHorizontal = isHorizontal;
        _self.hitTargets = [];

        for (var i = 0; i < _self.size; i++) {
            _self.hitTargets.push(new ns.HitTargetModel(_self, i));
        }

        _self.hitCount = function () {
            var count = 0;
            for (var i = 0; i < _self.hitTargets.length; i++) {
                if (_self.hitTargets[i].isHit) count++;
            }
            return count;
        };

        _self.isHit = function () {
            return _self.hitCount() > 0;
        };

        _self.isSunk = function () {
            return _self.hitCount() == _self.hitTargets.length;
        };

        _self.hit = function (posX, posY, onSuccess, onFailure) {
            var success = false;
            for (var i = 0; i < _self.hitTargets.length; i++) {
                _self.hitTargets[i].hit(posX, posY, function () {
                    success = true;
                });
                if (success) {
                    if (onSuccess) onSuccess();
                    return;
                }
            }
            if (onFailure) onFailure();
        };
    };
})();
