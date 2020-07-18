
const u = require("wlj-utilities");


module.exports = assertIsProofStep;

function assertIsProofStep(step) {
    u.scope(assertIsProofStep.name, context => {
        u.assert(() => u.isString(step));
    });
}
