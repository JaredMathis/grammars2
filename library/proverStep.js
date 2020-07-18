
const u = require('wlj-utilities');

const {
    prove,
    addProofToFile,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    removeGoal,
    trimProofs,
} = require('../grammars');
const parseGrammar = require('./parseGrammar');

module.exports = proverStep;

let log = false;

function proverStep(file, maxDepth) {
    let provedGoal = false;
    let changed;

    grammar = parseGrammar(file);
    if (log) console.log(proverStep.name, { file });

    u.scope(proverStep.name, x => {

        u.loop(grammar.goals, goal=> {
            u.merge(x, {step: 'proving goal'});
            if (log) console.log('proving goal', { goal });
            let found = false;
            let proof;
            u.loop(u.range(maxDepth, 1), depth => {
                proof = prove(grammar.rules, goal.left, goal.right, depth);
                if (proof !== false) {
                    // The goal is proved in two steps; it doesn't
                    // need to be its own proof. Remove the goal.
                    if (proof.length === 2) {
                        file = removeGoal(file, goal.left, goal.right);
                    } else {
                        found = true;
                    }

                    return true;
                }
            });

            if (found) {
                provedGoal = true;
                changed = true;
                u.merge(x, {proof});
                u.merge(x, {step: 'proved goal'});
                if (log) console.log('proved goal', { goal });

                file = addProofToFile(file, proof);
                if (log) console.log(proverStep.name + ' added proof to file')
                u.merge(x, {step: 'added proof goal'});
                return true;
            } else {
                if (log) console.log('did not yet prove goal', { goal });
            }
        });

        u.merge(x, {step: 'max3ProofSteps'});
        file = max3ProofSteps(file);
        file = formatFile(file);

        u.merge(x, {step: 'trimProofs'});
        let { newContents, anyChanged } = trimProofs(file);
        file = newContents;
        if (anyChanged) {
            //trimProofsChanged = true;
        }
        file = formatFile(file);

        if (log) console.log(proverStep.name + ' trimmed ')
        if (log) console.log(file);

        u.merge(x, {step: 'removeRedundantProofs'});
        file = removeRedundantProofs(file);
        file = formatFile(file);
    });

    if (log) console.log(proverStep.name, {changed, file});

    return { newProvedGoal: provedGoal, newContents: file };
}