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
    removeGoal,
} = require('./grammars');

logIndent(__filename, context => {
    let file = './grammars/grow.g';

    let grammar = loadGrammar(file);

    let maxDepth = 5;
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
            addProof(file, proof);
        }
    });

    max3ProofSteps(file);
});