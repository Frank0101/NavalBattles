/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../App/Models/ShipModel.js"/>
/// <reference path="../../App/Models/HitTargetModel.js"/>

describe("Ship Model Test", function () {
    var ns = window.navalBattles;
    var ship = null;

    beforeEach(function () {
        ship = new ns.ShipModel(2, 3, 4, true);
    });

    it("It should be created", function () {
        expect(ship).not.toBeNull();
    });

    it("It should have the desired position", function () {
        expect(ship.posX).toBe(2);
        expect(ship.posY).toBe(3);
    });

    it("It should have the desired size", function () {
        expect(ship.size).toBe(4);
    });

    it("It should have the desired orientation", function () {
        expect(ship.isHorizontal).toBeTruthy();
    });

    it("It should have the desired hit targets", function () {
        expect(ship.hitTargets.length).toBe(4);
        expect(ship.hitTargets[0].relPos).toBe(0);
        expect(ship.hitTargets[1].relPos).toBe(1);
        expect(ship.hitTargets[2].relPos).toBe(2);
        expect(ship.hitTargets[3].relPos).toBe(3);
    });

    it("It shouldn't be hit", function () {
        expect(ship.hitCount()).toBe(0);
        expect(ship.isHit()).toBeFalsy();
    });

    it("It shouldn't be sunk", function () {
        expect(ship.isSunk()).toBeFalsy();
    });

    it("It should be possible to hit the ship", function () {
        var success = null;
        ship.hit(2, 3, function () {
            success = true;
        });

        expect(success).toBeTruthy();
        expect(ship.hitCount()).toBe(1);
        expect(ship.isHit()).toBeTruthy();
        expect(ship.isSunk()).toBeFalsy();
        expect(ship.hitTargets[0].isHit).toBeTruthy();
        expect(ship.hitTargets[1].isHit).toBeFalsy();
        expect(ship.hitTargets[2].isHit).toBeFalsy();
        expect(ship.hitTargets[3].isHit).toBeFalsy();
    });

    it("It should be possible to miss the ship", function () {
        var failure = null;
        ship.hit(2, 4, null, function () {
            failure = true;
        });

        expect(failure).toBeTruthy();
        expect(ship.hitCount()).toBe(0);
        expect(ship.isHit()).toBeFalsy();
        expect(ship.isSunk()).toBeFalsy();
        expect(ship.hitTargets[0].isHit).toBeFalsy();
        expect(ship.hitTargets[1].isHit).toBeFalsy();
        expect(ship.hitTargets[2].isHit).toBeFalsy();
        expect(ship.hitTargets[3].isHit).toBeFalsy();
    });

    it("It should be possible to sink the ship", function () {
        var success = null;
        ship.hit(2, 3,
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeTruthy();
        expect(ship.hitCount()).toBe(1);
        expect(ship.isHit()).toBeTruthy();
        expect(ship.isSunk()).toBeFalsy();

        ship.hit(3, 3,
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeTruthy();
        expect(ship.hitCount()).toBe(2);
        expect(ship.isHit()).toBeTruthy();
        expect(ship.isSunk()).toBeFalsy();

        ship.hit(4, 3,
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeTruthy();
        expect(ship.hitCount()).toBe(3);
        expect(ship.isHit()).toBeTruthy();
        expect(ship.isSunk()).toBeFalsy();

        ship.hit(5, 3,
            function () { success = true; },
            function () { success = false; });

        expect(success).toBeTruthy();
        expect(ship.hitCount()).toBe(4);
        expect(ship.isHit()).toBeTruthy();
        expect(ship.isSunk()).toBeTruthy();
    });
});
