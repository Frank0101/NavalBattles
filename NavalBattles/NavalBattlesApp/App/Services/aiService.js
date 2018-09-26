angular.module("navalBattlesApp.services").service("aiService", [function () {
    var _self = this;

    _self.hit = function (board, onFinish) {
        var hitInfos = getHitInfos(board);
        var potentialHitPoints = detectPotentialHitPoints(hitInfos,
            board.sizeX, board.sizeY);

        var posX, posY;
        if (potentialHitPoints.length > 0) {
            var index = Math.floor(Math.random() * potentialHitPoints.length);
            var potentialHitPoint = potentialHitPoints[index];
            posX = potentialHitPoint.posX;
            posY = potentialHitPoint.posY;
        } else {
            do {
                posX = Math.floor(Math.random() * board.sizeX);
                posY = Math.floor(Math.random() * board.sizeY);
            } while (filterHitInfosByPos(hitInfos, posX, posY) != null)
        }

        board.hit(posX, posY);
        if (onFinish) onFinish();
    };

    function getHitInfos(board) {
        var hitInfos = [];

        for (var i = 0; i < board.ships.length; i++) {
            var ship = board.ships[i];
            for (var k = 0; k < ship.hitTargets.length; k++) {
                var hitTarget = ship.hitTargets[k];
                if (hitTarget.isHit) {
                    hitInfos.push({
                        posX: hitTarget.getAbsPos().posX,
                        posY: hitTarget.getAbsPos().posY,
                        isHit: true
                    });
                }
            }
        }

        for (var n = 0; n < board.missHits.length; n++) {
            var missHit = board.missHits[n];
            hitInfos.push({
                posX: missHit.posX,
                posY: missHit.posY,
                isHit: false
            });
        }

        return hitInfos;
    }

    function detectPotentialHitPoints(hitInfos, sizeX, sizeY) {
        var potentialHitPoints = [];

        for (var i = 0; i < hitInfos.length; i++) {
            var hitInfo = hitInfos[i];
            if (hitInfo.isHit) {
                var hitInfoAtN = hitInfo.posY > 0
                    ? filterHitInfosByPos(hitInfos, hitInfo.posX, hitInfo.posY - 1)
                    : null;
                var hitInfoAtS = hitInfo.posY < sizeY - 1
                    ? filterHitInfosByPos(hitInfos, hitInfo.posX, hitInfo.posY + 1)
                    : null;
                var hitInfoAtW = hitInfo.posX > 0
                    ? filterHitInfosByPos(hitInfos, hitInfo.posX - 1, hitInfo.posY)
                    : null;
                var hitInfoAtE = hitInfo.posX < sizeX - 1
                    ? filterHitInfosByPos(hitInfos, hitInfo.posX + 1, hitInfo.posY)
                    : null;

                if (hitInfo.posY > 0) {
                    if (hitInfoAtN == null && (areSideHitInfosNotHit(hitInfoAtW, hitInfoAtE) || isOppositeHitInfoHit(hitInfoAtS))) {
                        potentialHitPoints.push({
                            posX: hitInfo.posX,
                            posY: hitInfo.posY - 1
                        });
                    }
                }

                if (hitInfo.posY < sizeY - 1) {
                    if (hitInfoAtS == null && (areSideHitInfosNotHit(hitInfoAtW, hitInfoAtE) || isOppositeHitInfoHit(hitInfoAtN))) {
                        potentialHitPoints.push({
                            posX: hitInfo.posX,
                            posY: hitInfo.posY + 1
                        });
                    }
                }

                if (hitInfo.posX > 0) {
                    if (hitInfoAtW == null && (areSideHitInfosNotHit(hitInfoAtN, hitInfoAtS) || isOppositeHitInfoHit(hitInfoAtE))) {
                        potentialHitPoints.push({
                            posX: hitInfo.posX - 1,
                            posY: hitInfo.posY
                        });
                    }
                }

                if (hitInfo.posX < sizeX - 1) {
                    if (hitInfoAtE == null && (areSideHitInfosNotHit(hitInfoAtN, hitInfoAtS) || isOppositeHitInfoHit(hitInfoAtW))) {
                        potentialHitPoints.push({
                            posX: hitInfo.posX + 1,
                            posY: hitInfo.posY
                        });
                    }
                }
            }
        }

        return potentialHitPoints;
    }

    function filterHitInfosByPos(hitInfos, posX, posY) {
        for (var i = 0; i < hitInfos.length; i++) {
            var hitInfo = hitInfos[i];
            if (hitInfo.posX == posX && hitInfo.posY == posY) {
                return hitInfo;
            }
        }
        return null;
    }

    function areSideHitInfosNotHit(hitInfo1, hitInfo2) {
        return (hitInfo1 == null || !hitInfo1.isHit)
            && (hitInfo2 == null || !hitInfo2.isHit);
    }

    function isOppositeHitInfoHit(hitInfo) {
        return hitInfo != null && hitInfo.isHit;
    }
}]);
