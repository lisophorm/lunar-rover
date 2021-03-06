'use strict';

// Model the Moon, Lander and Rover as separate objects

// The Lander can land on the Moon
// The Lander will land at a specific position
// The Rover can disembark the Lander
// The Rover will disembark initially at the Landers position
// The Rover can move around the Moon

//**************************
// the main loop is at the very bottom
// due the limited amount of time I could not write async tests and I used static attributes
//
// also the gravity is very crude, but the associative array with all the objects could be used with a physics engine
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

// iteration stub in case we want to create more complex game logic

Lander.prototype.iteration = function (gravity,thrust) {
    //
    this.coords.y+=gravity;
    this.coords.x+=thrust;
}

Lander.prototype.pos = function (point) {
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


// iteration stub in case we want to create more complex game logic
Rover.prototype.iteration = function (gravity,thrust) {
    //
    this.coords.y+=gravity;
    this.coords.x+=thrust;
}

Rover.prototype.pos = function (point) {
    this.css({top: point.y, left: point.x});
}

// MOON OBJECT

function Moon() {
    this.coords = new Point();
}

// iteration stub in case we want to create more complex game logic
Moon.prototype.iteration = function () {
    console.log('iteration cycle of Moon');
}

Moon.prototype.pos = function (point) {
    this.css({top: point.y, left: point.x});
}

function GameEngine() {
    this.gravity=3;
    this.thrustDirection=0;
}

// Gets left + right

GameEngine.prototype.sendUserInput=function(keycode) {
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

    if(!this.actorList['rover'].disembarked) {
        //
        // rover and lander share same position until disembark
        // for simplicity the landing happens once lander collides with moon
        //
        if (!this.checkCollision(this.actorList['lander'],this.actorList['moon'])) {
            this.actorList['lander'].iteration(this.gravity,this.thrustDirection);

        } else {
            this.actorList['rover'].coords=this.actorList['lander'].coords;
            this.actorList['rover'].disembarked=true;
        }
    } else {
        //
        // rover is affected by "gravity" once detached
        //
        if (!this.checkCollision(this.actorList['rover'],this.actorList['moon'])) {
            this.actorList['rover'].iteration(this.gravity,0);
        }
    }

    if (!this.actorList['rover'].disembarked) {
        // The Rover will disembark initially at the Landers position
        this.actorList['lander'].pos(this.actorList['lander'].coords);
        this.actorList['rover'].pos(this.actorList['lander'].coords);
    } else {
        this.actorList['rover'].iteration(0,this.thrustDirection);
        this.actorList['rover'].pos(this.actorList['rover'].coords);
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

GameEngine.prototype.initGame = function() {

    this.actorList['moon'].pos(this.actorList['moon'].coords);

    // old trick for scoping
    var THIS = this;
    $(document).on('keydown', function(e){
        THIS.sendUserInput(e.which);

    });
    $(document).on('keyup', function(e){
        THIS.sendUserInput(0);
    });

    window.setInterval(function () {
        THIS.executeTick();
    }, 100);
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
    // also it would be helpful for a proper physics simulation

    gameEngine.addActor(lander, 'lander');
    gameEngine.addActor(rover, 'rover');
    gameEngine.addActor(moon, 'moon');

    // on a complete game I would use different states

    gameEngine.initGame();


});




