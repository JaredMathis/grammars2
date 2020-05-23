const {
    logIndent,
    assert,
    loop,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
    range,
} = require('../utilities/all');

const {
    loadGrammar,
    prove,
    addProofToFile,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    removeGoal,
    trimProofs,
} = require('./grammars');

module.exports = prover;

function prover(file) {
    logIndent(prover.name, context => {
        let log = true;
    
        let provedGoal = true;
        let provedGoals = 0;
        let skippedGoals = 0;
        while (provedGoal) {
            merge(context, {step: 'starting loop'});
            let grammar = loadGrammar(file);
    
            provedGoal = false;
    
            let maxDepth = 8;
            loop(grammar.goals, goal=> {
                merge(context, {step: 'proving goal'});
                let found = false;
                let proof;
                loop(range(maxDepth, 1), depth => {
                    proof = prove(grammar.rules, goal.left, goal.right, depth);
                    if (proof !== false) {
                        // The goal is proved in two steps; it doesn't
                        // need to be its own proof. Remove the goal.
                        if (proof.length === 2) {
                            removeGoal(file, goal.left, goal.right);
                            skippedGoals++;
                            merge(context, {skippedGoals});
                        } else {
                            found = true;
                            provedGoals++;
                            merge(context, {provedGoals});
                        }

                        return true;
                    }
                });
    
                if (found) {
                    provedGoal = true;
                    changed = true;
                    merge(context, {proof});
                    merge(context, {step: 'proved goal'});
                    if (log) console.log('proved goal', { goal });
    
                    addProofToFile(file, proof);
                    merge(context, {step: 'added proof goal'});
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