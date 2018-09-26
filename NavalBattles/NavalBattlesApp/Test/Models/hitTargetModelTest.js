/// <reference path="../../../Scripts/jasmine/jasmine.js"/>
/// <reference path="../../App/Models/ShipModel.js"/>
/// <reference path="../../App/Models/HitTargetModel.js"/>

describe("Hit Target Model Test", function () {
    var ns = window.navalBattles;
    var hitTarget = null;

    beforeEach(function () {
        hitTarget = new ns.HitTargetModel(null, 2);
    });

    it("It should be created", function () {
        expect(hitTarget).not.toBeNull();
    });

    it("It should have the desired rel position", function () {
        expect(hitTarget.relPos).toBe(2);
    });

    it("It shouldn't be hit", function () {
        expect(hitTarget.isHit).toBeFalsy();
    });

    describe("When owned by an horizontal ship", function () {
        var ship = new ns.ShipModel(2, 3, 4, true);

        beforeEach(function () {
            hitTarget = new ns.HitTargetModel(ship, 2);
        });

        it("It should refer the desider ship", function () {
            expect(hitTarget.ship).toBe(ship);
        });

        it("It should calculate its abs position", function () {
            expect(hitTarget.getAbsPos().posX).toBe(4);
            expect(hitTarget.getAbsPos().posY).toBe(3);
        });

        it("It should be possible to hit the target", function () {
            var success = null;
            hitTarget.hit(4, 3, function () {
                success = true;
            });

            expect(success).toBeTruthy();
            expect(hitTarget.isHit).toBeTruthy();
        });

        it("It should be possible to miss the target", function () {
            var failure = null;
            hitTarget.hit(5, 3, null, function () {
                failure = true;
            });

            expect(failure).toBeTruthy();
            expect(hitTarget.isHit).toBeFalsy();
        });
    });

    describe("When owned by a vertical ship", function () {
        var ship = new ns.ShipModel(2, 3, 4, false);

        beforeEach(function () {
            hitTarget = new ns.HitTargetModel(ship, 2);
        });

        it("It should refer the desider ship", function () {
            expect(hitTarget.ship).toBe(ship);
        });

        it("It should calculate its abs position", function () {
            expect(hitTarget.getAbsPos().posX).toBe(2);
            expect(hitTarget.getAbsPos().posY).toBe(5);
        });

        it("It should be possible to hit the target", function () {
            var success = null;
            hitTarget.hit(2, 5, function () {
                success = true;
            });

            expect(success).toBeTruthy();
            expect(hitTarget.isHit).toBeTruthy();
        });

        it("It should be possible to miss the target", function () {
            var failure = null;
            hitTarget.hit(3, 5, null, function () {
                failure = true;
            });

            expect(failure).toBeTruthy();
            expect(hitTarget.isHit).toBeFalsy();
        });
    });
});
