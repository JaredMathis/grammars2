const u = require('wlj-utilities');

const fs = require('fs');
const parseGrammar = require('./library/parseGrammar');
const assertIsProofStep = require('./library/assertIsProofStep');
const getLines = require('./library/getLines');
const getGoalToken = require('./library/getGoalToken');
const lineIsProofStep = require('./library/lineIsProofStep');
const isValidProof = require('./library/isValidProof');

module.exports = {
    loadGrammar,
    substitute,
    prove,
    addProofToFile,
    removeGoal,
    breakUpProof,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    trimProofs,
    
};

function loadGrammar(fileName) {
    let grammar;

    u.scope(loadGrammar.name, context => {
        u.merge(context, {fileName});
        const fileContents = u.readFile(fileName);
        grammar = parseGrammar(fileContents);
    });

    return grammar;
}

function lineIsRule(line) {
    let result;
    u.scope(lineIsRule.name, context => {
        u.assert(() => u.isString(line));

        let parts = line.split(' ');
        if (parts.length !== 2) {
            return false;
        }

        result ={
            left: parts[0],
            right: parts[1],
        }
    })

    return result;
}

function assertIsProof(proof) {
    u.scope(assertIsProof.name, context => {
        u.merge(context, {proof});

        u.assert(() => u.isArray(proof));
        u.loop(proof, p => {
            assertIsProofStep(p);
        })
    });
}

function substitute(left, right, previous, index) {
    let result;

    u.scope(substitute.name, context=> {
        u.merge(context, {left});
        u.merge(context, {right});
        u.merge(context, {previous});
        u.merge(context, {index});

        assertIsProofStep(left);
        assertIsProofStep(right);
        assertIsProofStep(previous);
        u.assert(() => u.isArrayIndex(previous, index));

        if (index + left.length > previous.length) {
            result = false;
            return;
        }

        let actualLeft = previous.substring(index, index + left.length);
        u.merge(context, {actualLeft});
        u.assert(() => actualLeft.length === left.length);
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
    u.scope(assertIsGrammarRules.name, context => {
        u.merge(context, {rules});
        u.assert(() => u.isArray(rules));
        u.loop(rules, r => {
            u.assert(() => u.isDefined(r));
            assertIsProofStep(r.left);
            assertIsProofStep(r.right);
        });
    });
}

function prove(rules, start, goal, depth, proof) {
    let log = false;
    if (log) console.log('prove entered', {depth});
    let found = false;
    u.scope(prove.name, x => {
        u.merge(x, {rules});
        u.merge(x, {start});
        u.merge(x, {goal});
        u.merge(x, {depth});
        u.merge(x, {proof});

        assertIsGrammarRules(rules);
        assertIsProofStep(start);
        assertIsProofStep(goal);
        // We don't need to prove our premise.
        u.assert(() => start !== goal);
        u.assert(() => u.isInteger(depth));
        u.assert(() => 0 <= depth);
        if (u.isUndefined(proof)) {
            proof = [];
            proof.push(start);
        }
        assertIsProof(proof);

        u.loop(u.range(start.length), index => {
            if (found) {
                return true;
            }
            u.loop(rules, rule => {
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

function addProofToFile(file, proof) {
    u.scope(addProofToFile.name, context => {
        // Add the proof.
        file += u.EOL
        u.loop(proof, p => {
            file += u.EOL
            file += p;
        });

        file = removeGoal(file, proof[0], u.arrayLast(proof));

        // Make sure proofs in file are valid.
        let grammar = parseGrammar(file);

        // Make sure last proof is the proof we added
        let lastRule = u.arrayLast(grammar.rules);
        u.merge(context, { lastRule });
        u.assert(() => lastRule.left === proof[0]);
        u.assert(() => lastRule.right === u.arrayLast(proof));
    });
    return file;
}

function removeGoal(file, left, right) {
    let log = false;
    u.scope(removeGoal.name, context => {
        u.merge(context, {file});
        u.merge(context, {left});
        u.merge(context, {right});

        assertIsProofStep(left);
        assertIsProofStep(right);

        let lines = getLines(file);

        let result = [];

        let goalCount = 0;

        u.loop(lines, line => {
            // Skip if the line is the goal.
            if (line === `${getGoalToken()} ${left} ${right}`) {
                goalCount++;
                return;
            }

            // Otherwise include the line.
            result.push(line);
        });

        u.assertIsEqual(() => goalCount, 1);

        file = result.join(u.EOL);

        u.merge(context, {result});
    });
    if (log) console.log(removeGoal.name + ' leaving', { file });
    return file;
}

function breakUpProof(proof) {
    let log = false;
    let result = [];
    u.scope(breakUpProof.name, context => {
        u.merge(context, {proof});
        // over 9 is untested
        u.assert(() => proof.length <= 9);

        let space = 1;
    
        while (space <= proof.length) {
            let i = 0;
            while (true) {
                let a = proof[i];
                if (u.isUndefined(a)) {
                    a = u.arrayLast(proof);
                }
                let b = proof[i + space];
                if (u.isUndefined(b)) {
                    b = u.arrayLast(proof);
                }
                let c = proof[i + 2*space];
                if (u.isUndefined(c)) {
                    c = u.arrayLast(proof);
                }

                let r = [a,b,c];
                if (log) console.log({r});

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
    let result = [];
    u.scope(max3ProofSteps.name, x => {
        u.merge(x,{file});
        // Make sure proofs are valid.
        parseGrammar(file);

        let lines = getLines(file);

        let proof = [];
        u.loop(lines, line => {
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            } else {
                result.push(line);
            }

            processProof();
        });
        processProof();

        function processProof() {
            if (proof.length === 0) {
                return;
            }
            let proofs = breakUpProof(proof);
            u.loop(proofs, p => {
                result.push('');
                u.loop(p, step=> {
                    result.push(step);
                });
            });
            // Clear the proof buffer now that we're processed a proof
            proof = [];
        }

        file = result.join(u.EOL);
    });
    return file;
}

function formatFile(file) {
    u.scope(formatFile.name, x => {
        u.merge(x,{file});
        let lines = getLines(file);
    
        if (lines.length === 0) {
            return;
        }
        
        let result = [
            lines[0],
        ];
    
        u.loop(u.range(lines.length - 1, 1), index => {
            let previous = lines[index - 1];
            let current = lines[index];
    
            if (current === '' && current === previous) {
                return;
            }
    
            result.push(current);
        })
    
        file = result.join(u.EOL);
    })
    return file;
}

function removeRedundantProofs(file) {
    let log = false;
    let result = [];
    u.scope(removeRedundantProofs.name, context => {
        u.merge(context, {file});

        u.merge(context, {step:'reading file'});
        let lines = getLines(file);

        let proof = [];
        let rules = [];
        u.merge(context, {step:'processing lines'});
        u.loop(lines, line => {
            let rule;
            if (rule = lineIsRule(line)) {
                rules.push(rule);
            }
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            }

            processProof();

            result.push(line);
        });
        processProof();

        file = result.join(u.EOL);

        function processProof() {
            u.scope(processProof.name, context => {
                if (proof.length === 0) {
                    return;
                }
                
                /** Omit the proof if it's provable in two-steps */
                let shorter = [proof[0], u.arrayLast(proof)];
                let valid = isValidProof(rules, shorter);
                if (log) console.log({shorter,valid});
                if (valid) {
                    // Clear proof buffer
                    proof = [];
                    return;
                }

                rules.push({left: proof[0], right: u.arrayLast(proof)});

                u.loop(proof, p=>{
                    result.push(p);
                });

                // Clear proof buffer
                proof = [];
            });
        }     
    });

    return file;
}

function trimProofs(file) {
    let log = false;
    if (log) console.log('trimProofs entered');

    let anyChanged = false;
    u.scope(trimProofs.name, context => {
        u.merge(context, {file});

        let lines = getLines(file);
        let newLines = [];

        let proof = [];
        let rules = [];
        let foundRule = false;
        u.merge(context, {lines0:lines[0]});
        u.loop(lines, line => {
            let rule;
            if (rule = lineIsRule(line)) {
                foundRule = true;
                rules.push(rule);
            }
            if (lineIsProofStep(line)) {
                u.assert(() => foundRule);
                proof.push(line);
                return;
            }

            processProof();

            newLines.push(line);
        });
        processProof();

        if (log) console.log({newLines});

        file = newLines.join(u.EOL);

        function processProof() {
            u.scope(processProof.name, context => {
                if (log) console.log(trimProofs.name + ' ' + processProof.name);
                if (log) console.log({proof});
                u.merge(context, {proof});
                if (proof.length === 0) {
                    return;
                }
                if (log) console.log('trimProofs processProof entered', { proof });

                u.assert(() => rules.length >= 1);

                // When we shorten the proof, the original
                // proof still needs to be derivable.
                let target = [proof[0], u.arrayLast(proof)];

                let trimRight = (step, i) => step.substring(0, step.length - i);
                let trimLeft = (step, i) => step.substring(i);
                let lastAllSame = (i) =>  {
                    return u.arrayAll(proof, step => {
                        let left = u.stringSuffix(step, i);
                        let right = u.stringSuffix(proof[0], i);
                        if (log) console.log({left,right,i});
                        return left === right;
                    }); 
                };
                let firstAllSame = (i) => u.arrayAll(proof, step => step.substring(0, i) === proof[0].substring(0, i));

                u.loop([{ predicate: firstAllSame, trim: trimLeft },
                    { predicate: lastAllSame, trim: trimRight },], t => {
                    let i = 0;
                    if (log) console.log({ predicate: t.predicate.name })

                    // Keep trimming
                    let changed = true;
                    while (changed) {
                        changed = false;
                        i++;

                        // We would be trimming more characters than what exist for 
                        // some proof step.
                        if (u.arraySome(proof, step => step.length <= i)) {
                            break;
                        }

                        if (t.predicate(i)) {
                            let trimmed = proof.map(step => t.trim(step, i));
                            if (log) console.log('trimProofs processProof trimmed', { trimmed });

                            if (isValidProof(rules, trimmed)) {
                                rules.push({left: trimmed[0], right: u.arrayLast(trimmed)});
            
                                if (!isValidProof(rules, target)) {
                                    rules.pop();
                                } else {
                                    // Proof can be trimmed
                                    changed = true;
                                    anyChanged = true;
                                    u.merge(context, {trimmed});
                                    if (log) console.log({proof, trimmed});
                                    u.loop(trimmed, p=>{
                                        newLines.push(p);
                                    });
                                    newLines.push('');
                                }
                            }
                        } else {
                            if (log) console.log('trimProofs processProof predicate failed');
                        }
                    }
                });
                
                // Maybe this will fail if proofs cannot
                // be trimmed like this
                u.merge(context, {rules});
                u.merge(context, {proof});
                u.assert(() => isValidProof(rules, proof));

                rules.push({left: proof[0], right: u.arrayLast(proof)});

                u.loop(proof, p=>{
                    newLines.push(p);
                });

                // Clear proof buffer
                proof = [];
            });
        }
    });

    return { anyChanged, newContents: file };
}