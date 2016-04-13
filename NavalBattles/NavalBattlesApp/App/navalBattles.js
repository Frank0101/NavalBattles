///#source 1 1 /NavalBattlesApp/App/Models/HitTargetModel.js
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

///#source 1 1 /NavalBattlesApp/App/Models/ShipModel.js
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

///#source 1 1 /NavalBattlesApp/App/Models/BoardModel.js
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

///#source 1 1 /NavalBattlesApp/App/navalBattlesApp.js
angular.module("navalBattlesApp", [
    "navalBattlesApp.controllers",
    "navalBattlesApp.services",
    "navalBattlesApp.directives"]);

angular.module("navalBattlesApp.controllers", []);
angular.module("navalBattlesApp.services", []);
angular.module("navalBattlesApp.directives", []);

///#source 1 1 /NavalBattlesApp/App/Controllers/navalBattlesController.js
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

///#source 1 1 /NavalBattlesApp/App/Services/placingService.js
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

///#source 1 1 /NavalBattlesApp/App/Services/aiService.js
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

///#source 1 1 /NavalBattlesApp/App/Directives/boardDirective.js
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

///#source 1 1 /NavalBattlesApp/App/Directives/hitGridDirective.js
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

