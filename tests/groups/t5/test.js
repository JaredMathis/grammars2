const fs = require('fs');
const path = require('path');

const prover = require('../../../prover');
const {
    loadGrammar,
 } = require('../../../grammars');

const {
    scope,
    assertIsEqual,
    readFile,
} = require('../../../../utilities/all');

scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't5');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    prover(testGrammar);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = readFile(testGrammar);
    let expected = readFile(path.join(directory, 'expected.g'))
    assertIsEqual(text, expected);
});