
const u = require("wlj-utilities");
const getGoalToken = require("./getGoalToken");


module.exports = lineIsGoal;

function lineIsGoal(line) {
    let goal;

    u.scope(lineIsGoal.name, context => {
        u.assert(() => u.isString(line));

        if (!line.startsWith(getGoalToken())) {
            return false;
        }

        let parts = line.split(' ');
        let goalParts = parts.slice(1);
        u.assert(() => goalParts.length === 2);
        goal = {left: goalParts[0], right: goalParts[1]}; 
    });
    return goal;
}