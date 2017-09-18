'use strict';

beforeEach(function () {
    setFixtures('<div id="moon"></div><div id="lander"><div id="rover"></div></div>');
});

// should have used async testing ;-)

describe("The Lander", function () {
    var lander=new Lander();

    it("can land on the Moon", function () {
        expect(lander.canLand).toBe(true);
    });

    it("will land at a specific position", function () {
        expect(lander.canLandAtSpecPos).toBe(true);
    });
});

describe("The Rover", function () {

    var rover=new Rover();

    it("can disembark the Lander", function () {
        expect(rover.canDisembark).toBe(true);

    });

    it("will disembark initially at the Landers position", function () {
        expect(rover.disembarkAtLanderPosition).toBe(true);
    });

    it("can move around the Moon", function () {
        expect(rover.canMoveAround).toBe(true);
    });
});
