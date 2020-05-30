const fs = require('fs');
const path = require('path');

const g = require('../../../index');
const {
    loadGrammar,
    removeRedundantProofs,
    trimProofs,
 } = require('../../../grammars');

const u = require('wlj-utilities');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't7');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    trimProofs(testGrammar);
    removeRedundantProofs(testGrammar);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = u.readFile(testGrammar);
    let expected = u.readFile(path.join(directory, 'expected.g'))
    //assertIsEqual(text, expected);
});