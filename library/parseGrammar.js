
const u = require("wlj-utilities");
const getLines = require("./getLines");
const lineIsGoal = require("./lineIsGoal");
const lineIsProofStep = require("./lineIsProofStep");
const isValidProof = require("./isValidProof");


module.exports = parseGrammar;

/**
 * Checks for proof correctness,
 * Checks for... TODO
 * @param {*} fileContents 
 */
function parseGrammar(fileContents) {
    let log = false;
    if (log) console.log('parseGrammar entered');

    let proof;
    let grammar;

    u.scope(parseGrammar.name, x => {
        u.merge(x,{fileContents});
        grammar = {};
        grammar.rules = [];
        grammar.goals = [];
        proof = [];

        let lines = getLines(fileContents);

        u.merge(x, {step:'processing lines'})
        u.loop(lines, line => {
            if (log) console.log('processing line', { line });

            // There should be no double spaces.
            u.assert(() => line.indexOf('  ') < 0);

            let parts = line.split(' ');

            let goal;
            if (goal = lineIsGoal(line)) {
                grammar.goals.push(goal);
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
    
            u.merge(x, {parts});
            u.assert(() => parts.length === 2);

            u.assert(() => parts[0].length >= 1);
            u.assert(() => parts[1].length >= 1);
            grammar.rules.push({ left: parts[0], right: parts[1]});
        });

        checkProof();

        // Make sure goals have not been proved.
        u.merge(x, {step:'already proved goals'})
        u.loop(grammar.goals, goal => {
            u.loop(grammar.rules, rule => {
                let goalAlreadyProved = goal.left === rule.left && goal.right === rule.right;
                u.merge(x, {goalAlreadyProved});
                u.assert(() => !goalAlreadyProved);
            });
        });

        function checkProof() {
            u.scope(checkProof.name, context => {
                if (log) console.log('checkProof entered', {proof});
                // If proof is empty, nothing to check
                if (proof.length === 0) {
                    return;
                }
        
                // If the proof is derivable from just first and last steps from previous
                // proofs, then this proof is redundant.
                let redundant = isValidProof(grammar.rules, [proof[0], u.arrayLast(proof)]);
                u.merge(context, {proof});
                u.assert(() => !redundant);
        
                let valid = isValidProof(grammar.rules, proof);
                u.assert(() => valid);
        
                // Add the first and last step of the proof as a new grammar rule.
                grammar.rules.push({left: proof[0], right: u.arrayLast(proof)});
        
                // Reset the proof.
                proof = [];
            });
        }
    });

    return grammar;
}
