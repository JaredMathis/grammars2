
const u = require('wlj-utilities');

const {
    loadGrammar,
    prove,
    addProofToFile,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    removeGoal,
    trimProofs,
} = require('../grammars');

module.exports = loadAndProver;

function loadAndProver(file, maxDepth) {
    u.scope(loadAndProver.name, x => {
        let log = false;

        if (u.isUndefined(maxDepth)) {
            maxDepth = 8;
        }
        u.assert(() => u.isInteger(maxDepth));
    
        let provedGoal = true;
        let provedGoals = 0;
        let skippedGoals = 0;
        while (provedGoal) {
            u.merge(x, {step: 'starting loop'});
            let grammar = loadGrammar(file);
    
            provedGoal = false;
    
            u.loop(grammar.goals, goal=> {
                u.merge(x, {step: 'proving goal'});
                let found = false;
                let proof;
                u.loop(u.range(maxDepth, 1), depth => {
                    proof = prove(grammar.rules, goal.left, goal.right, depth);
                    if (proof !== false) {
                        // The goal is proved in two steps; it doesn't
                        // need to be its own proof. Remove the goal.
                        if (proof.length === 2) {
                            removeGoal(file, goal.left, goal.right);
                            skippedGoals++;
                            u.merge(x, {skippedGoals});
                        } else {
                            found = true;
                            provedGoals++;
                            u.merge(x, {provedGoals});
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
    
                    addProofToFile(file, proof);
                    u.merge(x, {step: 'added proof goal'});
                    return true;
                } else {
                    if (log) console.log('did not yet prove goal', { goal });
                }
            });
    
            max3ProofSteps(file);
            formatFile(file);

            if (trimProofs(file)) {
                changed = true;
            }
            formatFile(file);

            removeRedundantProofs(file);
            formatFile(file);
        }
    });
}