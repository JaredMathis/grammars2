const fs = require('fs');
const path = require('path');

const prover = require('../../../prover');
const {
    loadGrammar,
    trimProofs,
    formatFile,
 } = require('../../../grammars');

const {
    logIndent,
    assertIsEqual,
    readFile,
} = require('../../../../utilities/all');

logIndent(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't10');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    trimProofs(testGrammar);
    formatFile(testGrammar);

    let text = readFile(testGrammar);
    let expected = readFile(path.join(directory, 'expected.g'))
    assertIsEqual(text, expected);
});