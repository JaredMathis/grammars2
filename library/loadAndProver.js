
const u = require('wlj-utilities');

const proverStep = require('./proverStep');
const overwriteFile = require('./overwriteFile');

module.exports = loadAndProver;

function loadAndProver(fileName, maxDepth) {
    let log = false;
    u.scope(loadAndProver.name, x => {
        if (u.isUndefined(maxDepth)) {
            maxDepth = 8;
        }
        u.assert(() => u.isInteger(maxDepth));
    
        let contents = u.readFile(fileName);

        let provedGoal = true;
        while (provedGoal) {
            u.merge(x, {step: 'starting loop'});

            let { newProvedGoal, newContents } = proverStep(contents, maxDepth);
            if (log) console.log(loadAndProver.name, { newContents, newProvedGoal })
            contents = newContents;
            contents = newContents;
            provedGoal = newProvedGoal;
        }

        overwriteFile(fileName, contents);
    });
}