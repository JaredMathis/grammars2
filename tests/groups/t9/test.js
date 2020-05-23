const fs = require('fs');
const path = require('path');

const prover = require('../../../prover');
const {
    loadGrammar,
 } = require('../../../grammars');

const {
    logIndent,
    assertIsEqual,
    readFile,
} = require('../../../../utilities/all');

logIndent(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't9');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    prover(testGrammar);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = readFile(testGrammar);
    let expected = readFile(path.join(directory, 'expected.g'))
    assertIsEqual(text, expected);
});