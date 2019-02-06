// Robot Class
// ------------------------------------------------
// The Robot class is used to instantiate a Robot. It has some helper functions that
// are able to move, place and report the robot/robot's location
// ----------------------------------------------------
// Example

// const robot = new Robot();
// robot.instuct('PLACE 0,0,NORTH');
// robot.instuct('MOVE');
// robot.instruct('REPORT'); //Gives back 0,1,NORTH
// ----------------------------------------------------

'use strict';

class Robot {

    // Whenever a robot is initialized, 
    // it is not placed on the board, 
    // we need a valid place command until we can do anything
    constructor() {
        this.coords = {
            x: null,
            y: null
        };
        this.direction = null;
        this.moves = []; //A collection of robot's movements. 
        //In a 5 x 5 matrix, these should be the bounds
        this.bounds = {
            min: { x: 0, y: 0 },
            max: { x: 4, y: 4 }
        };
        this.compass = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
        this.validCommands = ['PLACE', 'MOVE', 'LEFT', 'RIGHT', 'REPORT'];
        // isSafe checks if a move with the 'coords' is safe to execute or not,
        // Argument - coords <Object> {x: , y: }
        // Uses the last move and coords passed to generate a faux move 
        // that faux move is checked to be safe or not
        // Returns: Boolean - true for safe and false for unsafe
        this._isSafe = (coords) => {
            if (!coords instanceof Object) {
                throw new TypeError();
            }
            const lastMove = this.moves[this.moves.length - 1],
                move = Object.assign({}, lastMove, coords);

            return ((move.x >= this.bounds.min.x && move.x <= this.bounds.max.x) &&
                (move.y >= this.bounds.min.y && move.y <= this.bounds.max.y));
        }

        // We cannot perform any instruction on a robot till it is placed
        this._isPlaced = () => {
            return this.coords.x !== null || this.coords.y !== null;
        }

        // We support commands like 'PLACE X,Y,F' and 'MOVE',
        // getCommand returns the command issued and validates it
        this._getCommand = (instruction) => {
            const comm = instruction.split(' ')[0]; // Delimited by space, split and get the first value
            if (this.validCommands.indexOf[comm] === -1) {
                return null;
            } else {
                return comm;
            }
        };

        //  add move
        //  ----------------------------------------------------------------
        //  checks whether the latest coordinates are within the boundaries
        //  or if it the robot has been lost, if it is it'll add a new entry
        //  to the moves collection
        //  ================================================================
        //  @arg      {object}  coords
        //  ----------------------------------------------------------------
        this._addMove = (coords) => {
            if (!coords instanceof Object)
                throw new TypeError();

            const lastMove = this.moves[this.moves.length - 1],
                move = Object.assign({}, lastMove, coords);
            this.moves.push(move);
        }

        // place robot
        // ---------------------------------------------------------------------
        // Checks whether we want to place the robot is a safe place or not, 
        // After validation, it will place the robot onto given coordinates, 
        // and will add this move to our moves collection

        this._placeRobot = (coords, direction) => {
            if (!coords instanceof Object)
                throw new TypeError();
            //If the coordinates are unsafe or the direction is not valid, do nothing.
            if (!this._isSafe(coords) || this.compass.indexOf(direction) === -1) {
                return;
            }
            this.coords = Object.assign({}, coords); //Assign new coordinates.
            this.direction = direction;
            this._addMove({ ...this.coords, heading: direction });
        }

        //  turn
        //  -------------------------------------------
        //  gets the current heading of the robot,
        //  updates the heading and calls addMove to
        //  add a new movement to the moves collection.
        //  ===========================================
        //  @arg      {string}  dir
        //  -------------------------------------------
        this._turn = (dir) => {
            if (typeof dir !== 'number')
                throw new TypeError();

            const lastMove = this.moves[this.moves.length - 1];
            let currentHeading = this.compass.indexOf(lastMove.heading);

            currentHeading = currentHeading + dir;

            if (currentHeading < 0)
                currentHeading = 3;

            else if (currentHeading > 3)
                currentHeading = 0;

            this._addMove({
                heading: this.compass[currentHeading]
            });
        };

        //  move
        //  -------------------------------------------------
        //  checks which way to move and moves in that direction
        //  Adds move to the moves list
        //  -------------------------------------------------
        this._move = function () {
            const move = {},
                lastMove = this.moves[this.moves.length - 1];
            switch (lastMove.heading) {
                case 'NORTH':
                    move.y = lastMove.y + 1;
                    break;
                case 'EAST':
                    move.x = lastMove.x + 1;
                    break;
                case 'SOUTH':
                    move.y = lastMove.y - 1;
                    break;
                case 'WEST':
                    move.x = lastMove.x - 1;
                    break;
            }
            this._addMove(move);
        };
        this.instruct = (instruction) => {
            if (typeof instruction !== 'string') {
                return; //Ignore
            }
            const command = this._getCommand(instruction);

            // If invalid command, do nothing
            if (!command) {
                return;
            }

            switch (command) {
                case 'PLACE':
                    let coords, direction;
                    try {
                        let data = instruction.split(' ')[1].split(',');
                        coords = {
                            x: +data[0],
                            y: +data[1],
                        }
                        direction = data[2];
                    } catch (err) {
                        break;
                    }
                    this._placeRobot(coords, direction);
                    break;
                case 'LEFT':
                    if (!this._isPlaced())
                        return;
                    this._turn(-1);
                    break;
                case 'RIGHT':
                    if (!this._isPlaced())
                        return;
                    this._turn(1);
                    break;
                case 'MOVE':
                    if (!this._isPlaced())
                        return;
                    this._move();
                    break;
                case 'REPORT':
                    if (!this._isPlaced())
                        return;
                    const lastMove = this.moves[this.moves.length - 1];
                    console.log(`${lastMove.x},${lastMove.y},${lastMove.heading}`);
                    break;
            }
        }
    }
}


module.exports = Robot;