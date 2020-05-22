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
    isUndefined,
    arrayLast,
    appendFileLine,
} = require('./../utilities/all');

const fs = require('fs');

module.exports = {
    loadGrammar,
    isValidSubstitution,
    assertIsValidProof,
    assertIsValidGrammarFile,
    substitute,
    prove,
    addProof,
    removeGoal,
    breakUpProof,
};

function loadGrammar(fileName) {
    let grammar;

    logIndent(loadGrammar.name, context => {
        const fileContents = readFile(fileName);
        grammar = assertIsValidGrammarFile(fileContents);
    });

    return grammar;
}

const goalToken = "#goal";

function getLines(s) {
    let lines;
    logIndent(getLines.name, context => {
        assert(() => isString(s));

        lines = s.split(`
`);
        
    });
    return lines;
}

function lineIsProofStep(line) {
    return line.indexOf(' ') < 0;
}

function assertIsValidGrammarFile(fileContents) {
    let log = false;
    if (log) console.log('assertIsValidGrammarFile entered');

    let proof;
    let grammar;

    logIndent(assertIsValidGrammarFile.name, context => {
        grammar = {};
        grammar.rules = [];
        grammar.goals = [];
        proof = [];

        let lines = getLines(fileContents);

        merge(context, {step:'processing lines'})
        loop(lines, line => {
            if (log) console.log('processing line', { line });

            // There should be no double spaces.
            assert(() => line.indexOf('  ') < 0);

            let parts = line.split(' ');

            if (line.startsWith(goalToken)) {
                let goal = parts.slice(1);
                assert(() => goal.length === 2);
                grammar.goals.push({left: goal[0], right: goal[1]});
                return;
            }

            if (line === '') {
                checkProof();
                return;
            }

            // This is a proof step
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            }
    
            merge(context, {parts});
            assert(() => parts.length === 2);

            assert(() => parts[0].length >= 1);
            assert(() => parts[1].length >= 1);
            grammar.rules.push({ left: parts[0], right: parts[1]});
        });

        checkProof();

        // Make sure goals have not been proved.
        merge(context, {step:'already proved goals'})
        loop(grammar.goals, goal => {
            loop(grammar.rules, rule => {
                let goalAlreadyProved = goal.left === rule.left && goal.right === rule.right;
                merge(context, {goalAlreadyProved});
                assert(() => !goalAlreadyProved);
            });
        });
    });

    return grammar;

    function checkProof() {
        if (log) console.log('checkProof entered', {proof});
        // If proof is empty, nothing to check
        if (proof.length === 0) {
            return;
        }

        assertIsValidProof(grammar.rules, proof);

        // Add the first and last step of the proof as a new grammar rule.
        grammar.rules.push({left: proof[0], right: arrayLast(proof)});

        // Reset the proof.
        proof = [];
    }
}

function assertIsProofStep(step) {
    logIndent(assertIsProofStep.name, context => {
        assert(() => isString(step));
    });
}

function assertIsProof(proof) {
    logIndent(assertIsProof.name, context => {
        merge(context, {proof});

        assert(() => isArray(proof));
        loop(proof, p => {
            assertIsProofStep(p);
        })
    });
}

function assertIsValidProof(rules, proof) {
    let log = false;
    if (log) console.log('assertIsValidProof entered', {rules, proof});
    logIndent(assertIsValidProof.name, context => {
        merge(context, {rules});
        merge(context, {proof});

        assert(() => isArray(rules));

        // Proof should have at least 2 steps
        assert(() => proof.length > 2);

        merge(context, {step:'processing proof steps'});
        loop(range(proof.length - 1, 1), (currentIndex) => {
            let valid = false;

            let previousIndex = currentIndex - 1;
            merge(context, {previousIndex});

            let previous = proof[previousIndex];
            merge(context, {previous});

            let current = proof[currentIndex];            

            let allS = [];
            loop(range(previous.length), previousIndex => {
                loop(rules, rule => {
                    if (valid) {
                        return;
                    }
                    let s = isValidSubstitution(
                        previous, current, rule.left, rule.right, previousIndex);
                    allS.push(s);
                    merge(context, {s});
                    assert(() => !valid);
                    valid = s.valid;
                });
                if (valid) {
                    return;
                }
            });

            merge(context, {allS});
            merge(context, {valid});
            assert(() => valid);
        });
    });
}

function isValidSubstitution(previous, current, left, right, index) {
    let log = false;
    if (log) console.log('isValidSubstitution entered', {previous, current, left, right, index});

    let result = {};
    logIndent(isValidSubstitution.name, context => {
        merge(context, {previous});
        merge(context, {current});
        merge(context, {left});
        merge(context, {right});
        merge(context, {index});

        assertIsProofStep(previous);
        assertIsProofStep(current);
        assertIsProofStep(left);
        assertIsProofStep(right);
        assert(() => isInteger(index));

        // Leading up to the rule before and current should match.
        let previousBefore = previous.substring(0, index);
        merge(context, {previousBefore});
        let currentBefore = current.substring(0, index);
        merge(context, {currentBefore});
        if (previousBefore !== currentBefore) {
            result.valid = false;
            result.message = 'before does not match';
            return;
        }

        // The previous should match the rule left.
        let previousMatch = previous.substring(index, index + left.length);
        merge(context, {previousMatch});
        if (previousMatch !== left) {
            result.valid = false;
            result.message = 'left does not match previous';
            return;
        }

        // The current should match the rule right.
        let currentMatch = current.substring(index, index + right.length);
        merge(context, {currentMatch});
        if (currentMatch !== right) {
            result.valid = false;
            result.message = 'right does not match current';
            return;
        }

        // The afters should match.
        let previousAfter = previous.substring(index + left.length);
        merge(context, {previousAfter});
        let currentAfter = current.substring(index + right.length);
        merge(context, {currentAfter});
        if (previousAfter !== currentAfter) {
            result.valid = false;
            result.message = 'after does not match';
            return;
        }

        result.valid = true;
    });

    if (log) console.log({result});

    return result;
}

function substitute(left, right, previous, index) {
    let result;

    logIndent(substitute.name, context=> {
        merge(context, {left});
        merge(context, {right});
        merge(context, {previous});
        merge(context, {index});

        assertIsProofStep(left);
        assertIsProofStep(right);
        assertIsProofStep(previous);
        assert(() => isArrayIndex(previous, index));

        if (index + left.length > previous.length) {
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

function assertIsGrammarRules(rules) {
    logIndent(assertIsGrammarRules.name, context => {
        merge(context, {rules});
        assert(() => isArray(rules));
        loop(rules, r => {
            assert(() => isDefined(r));
            assertIsProofStep(r.left);
            assertIsProofStep(r.right);
        });
    });
}

function prove(rules, start, goal, depth, proof) {
    let log = false;
    if (log) console.log('prove entered', {depth});
    let found = false;
    logIndent(prove.name, context => {
        merge(context, {rules});
        merge(context, {start});
        merge(context, {goal});
        merge(context, {depth});
        merge(context, {proof});

        assertIsGrammarRules(rules);
        assertIsProofStep(start);
        assertIsProofStep(goal);
        // We don't need to prove our premise.
        assert(() => start !== goal);
        assert(() => isInteger(depth));
        assert(() => 0 <= depth);
        if (isUndefined(proof)) {
            proof = [];
            proof.push(start);
        }
        assertIsProof(proof);

        loop(range(start.length), index => {
            if (found) {
                return true;
            }
            loop(rules, rule => {
                if (found) {
                    return true;
                }
                let s = substitute(rule.left, rule.right, start, index);
                if (s === false) {
                    return;
                }
                proof.push(s);
                if (s === goal) {
                    if (log) console.log('found', {s, proof});
                    found = true;
                    return;
                }
                if (depth > 1) {
                    if (log) console.log('calling prove');
                    let result = prove(rules, s, goal, depth-1, proof);
                    if (log) console.log('called prove', { result });
                    if (result !== false) {
                        found = true;
                        return;
                    }
                }
                proof.pop();
                if (log) console.log({ depth, proof })
            });
        });
    });

    if (log) console.log('prove leaving', { depth, proof });

    if (found) {
        return proof;
    }

    return false;
}

function addProof(file, proof) {
    logIndent(addProof.name, context => {
        // Add the proof.
        appendFileLine(file);
        loop(proof, p => {
            appendFileLine(file);
            fs.appendFileSync(file, p);
        });

        removeGoal(file, proof[0], arrayLast(proof));

        // Make sure proofs in file are valid.
        let grammar = loadGrammar(file);

        // Make sure last proof is the proof we added
        let lastRule = arrayLast(grammar.rules);
        merge(context, { lastRule });
        assert(() => lastRule.left === proof[0]);
        assert(() => lastRule.right === arrayLast(proof));
    });
}

function removeGoal(file, left, right) {
    logIndent(removeGoal.name, context => {
        merge(context, {file});
        merge(context, {left});
        merge(context, {right});

        assertIsProofStep(left);
        assertIsProofStep(right);

        let fileContents = readFile(file);
        let lines = getLines(fileContents);

        let result = [];

        loop(lines, line => {
            // Skip if the line is the goal.
            if (line === `${goalToken} ${left} ${right}`) {
                return;
            }

            // Otherwise include the line.
            result.push(line);
        });

        // Reset file contents.
        fs.writeFileSync(file, '');
        loop(result, line => {
            appendFileLine(file, line);
        });
    });
}

function breakUpProof(proof) {
    let result = [];
    logIndent(breakUpProof.name, context => {
        let space = 1;
    
        while (space <= proof.length) {
            let i = 0;
            while (true) {
                let a = proof[i];
                if (isUndefined(a)) {
                    a = arrayLast(proof);
                }
                let b = proof[i + space];
                if (isUndefined(b)) {
                    b = arrayLast(proof);
                }
                let c = proof[i + 2*space];
                if (isUndefined(c)) {
                    c = arrayLast(proof);
                }

                let r = [a,b,c];
                console.log({r});

                if (a === b && b === c && c === a) {
                    break;
                }

                i+= space*2;

                if (a === b || b === c || a === c) {
                    continue;
                }

                result.push(r);
            }
    
            space *= 2;
        }   
    });

    return result;
}

function max3ProofSteps(file) {
    const maxProofSteps = 3;
    let result = [];
    logIndent(max3ProofSteps.name, context => {
        // Make sure proofs are valid.
        loadGrammar(file);

        let fileContents = readFile(file);
        let lines = getLines(fileContents);

        let proof = [];
        loop(lines, line => {
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            } else {
                result.push(line);
            }

            checkProof();
        });

        
    });
}