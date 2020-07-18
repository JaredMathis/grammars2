
const u = require("wlj-utilities");
const assertIsProofStep = require("./assertIsProofStep");


module.exports = isValidSubstitution;

function isValidSubstitution(previous, current, left, right, index) {
    let log = false;
    if (log) console.log('isValidSubstitution entered', {previous, current, left, right, index});

    let result = {};
    u.scope(isValidSubstitution.name, context => {
        u.merge(context, {previous});
        u.merge(context, {current});
        u.merge(context, {left});
        u.merge(context, {right});
        u.merge(context, {index});

        assertIsProofStep(previous);
        assertIsProofStep(current);
        assertIsProofStep(left);
        assertIsProofStep(right);
        u.assert(() => u.isInteger(index));

        // Leading up to the rule before and current should match.
        let previousBefore = previous.substring(0, index);
        u.merge(context, {previousBefore});
        let currentBefore = current.substring(0, index);
        u.merge(context, {currentBefore});
        if (previousBefore !== currentBefore) {
            result.valid = false;
            result.message = 'before does not match';
            return;
        }

        // The previous should match the rule left.
        let previousMatch = previous.substring(index, index + left.length);
        u.merge(context, {previousMatch});
        if (previousMatch !== left) {
            result.valid = false;
            result.message = 'left does not match previous';
            return;
        }

        // The current should match the rule right.
        let currentMatch = current.substring(index, index + right.length);
        u.merge(context, {currentMatch});
        if (currentMatch !== right) {
            result.valid = false;
            result.message = 'right does not match current';
            return;
        }

        // The afters should match.
        let previousAfter = previous.substring(index + left.length);
        u.merge(context, {previousAfter});
        let currentAfter = current.substring(index + right.length);
        u.merge(context, {currentAfter});
        if (previousAfter !== currentAfter) {
            result.valid = false;
            result.message = 'after does not match';
            return;
        }

        result.valid = true;
    });

    if (log) console.log({result});

    return result;
}