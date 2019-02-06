const fs = require('fs');
const Robot = require('./src/robot');

fs.readFile('directions.txt', 'utf8', function(err, contents) {
    const robot = new Robot();
    const instructions = contents.split('\n');
    for(instruction of instructions) {
        robot.instruct(instruction);
    }
});