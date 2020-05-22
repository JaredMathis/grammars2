const {
    assert,
    logIndent,
    merge,
    loop,
    readFile,
    isInteger,
    isDefined,
    isString,
    isArray,
    isArrayIndex,
    range,
} = require('./../utilities/all');

module.exports = {
    loadGrammar,
    isValidSubstitution,
    assertIsValidProof,
    assertIsValidGrammarFile,
    substitute,
};

function loadGrammar(fileName) {
    let grammar;

    logIndent(loadGrammar.name, context => {
        const fileContents = readFile(fileName);
        grammar = assertIsValidGrammarFile(fileContents);
    });

    return grammar;
}

function assertIsValidGrammarFile(fileContents) {
    let proof;
    let grammar;

    logIndent(assertIsValidGrammarFile.name, context => {
        grammar = {};
        grammar.rules = [];
        proof = [];
let lines = fileContents.split(`
`);
        loop(lines, line => {
            // There should be no double spaces.
            assert(() => line.indexOf('  ') < 0);

            if (line === '') {
                checkProof();
                return;
            }

            if (line.indexOf(' ') < 0) {
                return;
            }
    
            let parts = line.split(' ');
            merge(context, {parts});
            assert(() => parts.length === 2);

            assert(() => parts[0].length >= 1);
            assert(() => parts[1].length >= 1);
            grammar.rules.push({ left: parts[0], right: parts[1]});
        });

        checkProof();
    });

    return grammar;

    function checkProof() {
        // If proof is empty, nothing to check
        if (proof.length === 0) {
            return;
        }

        assertIsValidProof(grammar.rules, proof);

        // Add the first and last step of the proof as a new grammar rule.
        grammar.rules.push({left: proof[0], right: proof[proof.length-1]});

        // Reset the proof.
        proof = [];
    }
}

function assertIsValidProof(rules, proof) {
    logIndent(assertIsValidProof.name, context => {
        merge(context, {rules});
        merge(context, {proof});

        assert(() => isArray(rules));
        assert(() => isArray(proof));

        // Proof should have at least 2 steps
        assert(() => proof.length > 2);

        loop(range(proof.length - 1, 1), (currentIndex) => {
            let valid = false;

            let previousIndex = currentIndex - 1;
            merge(context, {previousIndex});

            let previous = proof[previousIndex];
            merge(context, {previous});

            let current = proof[currentIndex];            

            loop(range(previous.length), previousIndex => {
                loop(rules, rule => {
                    if (isValidSubstitution(
                            previous, current, rule.left, rule.right, previousIndex)) {
                        valid = true;
                        return;
                    }
                });
                if (valid) {
                    return;
                }
            });

            assert(() => valid);
        });
    });
}

function isValidSubstitution(previous, current, left, right, j) {
    let result = {};
    logIndent(isValidSubstitution.name, context => {
        merge(context, {previous});
        merge(context, {current});
        merge(context, {left});
        merge(context, {right});
        merge(context, {j});

        assert(() => isString(previous));
        assert(() => isString(current));
        assert(() => isString(left));
        assert(() => isString(right));
        assert(() => isInteger(j));

        // Leading up to the rule before and current should match.
        let previousBefore = previous.substring(0, j);
        merge(context, {previousBefore});
        let currentBefore = current.substring(0, j);
        merge(context, {currentBefore});
        if (previousBefore !== currentBefore) {
            result.valid = false;
            result.message = 'before does not match';
            return;
        }

        // The previous should match the rule left.
        let previousMatch = previous.substring(j, j + left.length);
        merge(context, {previousMatch});
        if (previousMatch !== left) {
            result.valid = false;
            result.message = 'left does not match previous';
            return;
        }

        // The current should match the rule right.
        let currentMatch = current.substring(j, j + right.length);
        merge(context, {currentMatch});
        if (currentMatch !== right) {
            result.valid = false;
            result.message = 'right does not match current';
            return;
        }

        // The afters should match.
        let previousAfter = previous.substring(j + left.length);
        merge(context, {previousAfter});
        let currentAfter = current.substring(j + right.length);
        merge(context, {currentAfter});
        if (previousAfter !== currentAfter) {
            result.valid = false;
            result.message = 'after does not match';
            return;
        }

        result.valid = true;
    });

    return result;
}

function substitute(left, right, previous, index) {
    let result;

    logIndent(substitute.name, context=> {
        merge(context, {left});
        merge(context, {right});
        merge(context, {previous});
        merge(context, {index});

        assert(() => isString(left));
        assert(() => isString(right));
        assert(() => isString(previous));
        assert(() => isArrayIndex(previous, index));

        if (index + left.length > previous.length - 1) {
            result = false;
            return;
        }

        let actualLeft = previous.substring(index, index + left.length);
        merge(context, {actualLeft});
        assert(() => actualLeft.length === left.length);
        if (actualLeft !== left) {
            result = false;
            return;
        }

        let remaining = previous.substring(index + left.length);

        let before = previous.substring(0, index);
        result = before + right + remaining;
    });

    return result;
}

function prove(rules, left, right, depth) {


}
