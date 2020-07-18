
const u = require("wlj-utilities");


module.exports = lineIsProofStep;

function lineIsProofStep(line) {
    return line.length > 0 && line.indexOf(' ') < 0;
}
