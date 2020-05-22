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
} = require('./grammars');

logIndent(__filename, context => {
    let file = './grammars/grow.g';

    let grammar = loadGrammar(file);

    let maxDepth = 8;
    loop(grammar.goals, goal=> {
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
            console.log('proved goal', { goal });
            addProof(file, proof);
        } else {
            console.log('did not yet prove goal', { goal });
        }
    });

    max3ProofSteps(file);
});