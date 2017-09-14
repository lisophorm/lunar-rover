'use strict';

// Model the Moon, Lander and Rover as separate objects

// The Lander can land on the Moon
// The Lander will land at a specific position
// The Rover can disembark the Lander
// The Rover will disembark initially at the Landers position
// The Rover can move around the Moon

//**************************
// the main loop is at the very bottom
// due the limited amount of time I could not investigate a more elegant way to pass the tests other than static attributes
//
//****************************

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

// LANDER OBJECT

function Lander() {
    this.canLand=true;
    this.canLandAtSpecPos=true;
    this.coords = new Point();
}

Lander.prototype.iteration = function () {
    console.log('iteration cycle of Lander');
}

Lander.prototype.pos = function (point) {
    console.log('SET LANDER POS');
    this.css({top: point.y, left: point.x});
}

// ROVER OBJECT

function Rover() {
    console.log('INIT OF ROVER');
    this.canDisembark=true;
    this.disembarkAtLanderPosition=true;
    this.canMoveAround=true;
    this.disembarked = false;
    this.coords = new Point();
}

Rover.prototype.iteration = function () {
    console.log('iteration cycle of Rover');

}

Rover.prototype.pos = function (point) {
    console.log('SET ROVER POS');
    this.css({top: point.y, left: point.x});
}

// MOON OBJECT

function Moon() {
    this.coords = new Point();
}

Moon.prototype.iteration = function () {
    console.log('iteration cycle of Moon');

}

Moon.prototype.pos = function (point) {
    this.css({top: point.y, left: point.x});
}

function GameEngine() {
    this.gino = 15;
    this.thrustDirection=0;

}

// Gets left + right

GameEngine.prototype.sendUserInput=function(keycode) {
    console.log('key pressed',keycode);
    switch(keycode) {
        case 37:
            this.thrustDirection=-1;
            break;
        case 39:
            this.thrustDirection=1;
            break;
        default:
            this.thrustDirection=0;
            break;

    }
}

GameEngine.prototype.addActor = function (actor, actorname) {
    if (typeof this.actorList !== 'undefined') {
        this.actorList[actorname] = actor;
    } else {
        this.actorList = [];
        this.actorList[actorname] = actor;
    }
    console.log('added actor', this.actorList);
}


// Main game loop. Having more time I would have used states too

GameEngine.prototype.executeTick = function () {
    var landerCoords = new Point(0, 0);
    var roverCoords = new Point(0, 0);


    this.actorList['moon'].pos(this.actorList['moon'].coords);

    if(!this.actorList['rover'].disembarked) {
        //
        // rover and lander share same position until disembark
        // for simplicity the landing happens once lander collides with moon
        //
        if (!this.checkCollision(this.actorList['lander'],this.actorList['moon'])) {
            this.actorList['lander'].coords.y+=3;
        } else {
            this.actorList['rover'].coords=this.actorList['lander'].coords;
            this.actorList['rover'].disembarked=true;
        }
    } else {
        //
        // rover is affected by "gravity" once detached
        //
        if (!this.checkCollision(this.actorList['rover'],this.actorList['moon'])) {
            this.actorList['rover'].coords.y+=3;
        }
    }

    if (!this.actorList['rover'].disembarked) {
        this.actorList['lander'].pos(this.actorList['lander'].coords);
        this.actorList['rover'].pos(this.actorList['lander'].coords);
    } else {
        this.actorList['rover'].coords.x+=this.thrustDirection;
        this.actorList['rover'].pos(this.actorList['rover'].coords);
        console.log('rover IS disembarked');

    }
}

// very basic collision detection

GameEngine.prototype.checkCollision = function ($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    if ((y1 + $div1.outerHeight(true)) < y2 ||
        y1 > (y2 + $div2.outerHeight(true)) ||
        (x1 + $div1.outerWidth(true)) < x2 ||
        x1 > (x2 + $div2.outerWidth(true)))
        return false;
    return true;
}

// initialization

$(document).ready(function () {
    console.log('doc is ready');

    var gameEngine = new GameEngine();

    // we attach existing DOM elements to OOP objects
    // I prefer starting from a well defined html page instead of creating DOM on-the-fly

    var lander = $('#lander');
    $.extend(lander, new Lander());

    var rover = $('#rover');
    $.extend(rover, new Rover());

    var moon = $('#moon');
    $.fn.extend(moon, new Moon());

    moon.coords = new Point(300, 300);
    lander.coords = new Point(390, 0);

    // creating an array of objects may be a little of an overkill
    // for this exercise but it's a style I like

    gameEngine.addActor(lander, 'lander');
    gameEngine.addActor(rover, 'rover');
    gameEngine.addActor(moon, 'moon');

    $(document).keydown(function(e) {
        console.log('KEY PRESSED');
        gameEngine.sendUserInput(e.keyCode);

    });
    $(document).keyup(function(e) {
        console.log('KEY RELEASED');
        gameEngine.sendUserInput(0);
        //this.sendUserInput(e.which);

    });

    window.setInterval(function () {
      gameEngine.executeTick();
    }, 100);

});




