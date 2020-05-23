const fs = require('fs');
const path = require('path');

const prover = require('../../prover');
const {
    loadGrammar,
    removeRedundantProofs,
    trimProofs,
 } = require('../../grammars');

const {
    logIndent,
    assertIsEqual,
    readFile,
} = require('../../../utilities/all');

logIndent(__filename, context => {
    let directory = './tests/t7/';
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    trimProofs(testGrammar);
    removeRedundantProofs(testGrammar);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = readFile(testGrammar);
    let expected = readFile(path.join(directory, 'expected.g'))
    //assertIsEqual(text, expected);
});