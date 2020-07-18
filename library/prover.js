
const u = require("wlj-utilities");
const proverStep = require("./proverStep");


module.exports = prover;

function prover(contents, maxDepth) {
    let log = false;
    u.scope(prover.name, x => {

        if (u.isUndefined(maxDepth)) {
            maxDepth = 8;
        }
        u.assert(() => u.isInteger(maxDepth));

        let provedGoal = true;
        while (provedGoal) {
            u.merge(x, {step: 'starting loop'});

            let { newProvedGoal, newContents } = proverStep(contents, maxDepth);
            if (log) console.log(loadAndProver.name, { newContents, newProvedGoal })
            contents = newContents;
            contents = newContents;
            provedGoal = newProvedGoal;
        }
    });
    return contents;
}
