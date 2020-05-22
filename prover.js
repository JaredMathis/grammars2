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
    addProof,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
} = require('./grammars');

module.exports = prover;

function prover(file) {
    logIndent(prover.name, context => {
        let log = false;
    
        let changed = true;
    
        while (changed) {
            let grammar = loadGrammar(file);
    
            changed = false;
    
            let maxDepth = 8;
            loop(grammar.goals, goal=> {
                merge(context, {step: 'proving goal'});
                let found = false;
                let proof;
                loop(range(maxDepth, 1), depth => {
                    proof = prove(grammar.rules, goal.left, goal.right, depth);
                    if (proof !== false) {
                        found = true;
                        return;
                    }
                });
    
                if (found) {
                    changed = true;
                    merge(context, {proof});
                    merge(context, {step: 'proved goal'});
                    if (log) console.log('proved goal', { goal });
    
                    addProof(file, proof);
                    merge(context, {step: 'added proof goal'});
                } else {
                    if (log) console.log('did not yet prove goal', { goal });
                }
            });
    
            max3ProofSteps(file);
            removeRedundantProofs(file);
    
            formatFile(file);
        }
    });
}