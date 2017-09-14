'use strict';

beforeEach(function () {
    setFixtures('<div id="moon"></div><div id="lander"><div id="rover"></div></div>');
});

describe("The Lander", function () {
    var lander=new Lander();

    it("can land on the Moon", function () {
        expect(false).toEqual(lander.canLand);
    });

    it("will land at a specific position", function () {
        expect(false).toEqual(lander.canLandAtSpecPos);
    });
});

describe("The Rover", function () {

    var rover=new Rover();

    it("can disembark the Lander", function () {
        expect(false).toEqual(rover.canDisembark);
    });

    it("will disembark initially at the Landers position", function () {
        expect(false).toEqual(rover.disembarkAtLanderPosition);
    });

    it("can move around the Moon", function () {
        expect(false).toEqual(rover.canMoveAround);
    });
});
