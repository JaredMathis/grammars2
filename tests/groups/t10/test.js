const fs = require('fs');
const path = require('path');

const prover = require('../../../prover');
const {
    loadGrammar,
    trimProofs,
    formatFile,
 } = require('../../../grammars');

 const u = require('wlj-utilities');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't10');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    trimProofs(testGrammar);
    formatFile(testGrammar);

    let text = u.readFile(testGrammar);
    let expected = u.readFile(path.join(directory, 'expected.g'))
    u.assertIsEqual(text, expected);
});