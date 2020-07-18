
const u = require("wlj-utilities");
const assertIsProofStep = require("./assertIsProofStep");
const isValidSubstitution = require("./isValidSubstitution");


module.exports = isValidProof;

function isValidProof(rules, proof) {
    let result = true;
    let log = false;
    if (log) console.log('isValidProof entered', {rules, proof});
    u.scope(isValidProof.name, x => {
        u.merge(x, {rules});
        u.merge(x, {proof});

        u.assert(() => u.isArray(rules));
        u.assert(() => u.isArray(proof));
        u.loop(proof, step => {
            assertIsProofStep(step);
        })

        u.merge(x, {step:'processing proof steps'});
        u.loop(u.range(proof.length - 1, 1), (currentIndex) => {
            let validStep = false;

            let previousIndex = currentIndex - 1;
            u.merge(x, {previousIndex});

            let previous = proof[previousIndex];
            u.merge(x, {previous});

            let current = proof[currentIndex];            

            let allS = [];
            u.loop(u.range(previous.length), previousIndex => {
                u.loop(rules, rule => {
                    if (validStep) {
                        return true;
                    }
                    let s = isValidSubstitution(
                        previous, current, rule.left, rule.right, previousIndex);
                    allS.push(s);
                    u.merge(x, {s});
                    u.assert(() => !validStep);
                    validStep = s.valid;
                });
                if (validStep) {
                    return true;
                }
            });

            u.merge(x, {allS});
            u.merge(x, {validStep});

            if (!validStep) {
                result = false;
                return;
            }
        });
    });

    return result;
}