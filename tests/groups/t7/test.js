const fs = require('fs');
const path = require('path');

const g = require('../../../index');
const {
    loadGrammar,
    removeRedundantProofs,
    trimProofs,
 } = require('../../../grammars');

const u = require('wlj-utilities');
const overwriteFile = require('../../../library/overwriteFile');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't7');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    let file = u.readFile(testGrammar);
    let { anyChanged, newContents } = trimProofs(file);
    file = newContents;
    file = removeRedundantProofs(file);
    overwriteFile(testGrammar, file);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = u.readFile(testGrammar);
    let expected = u.readFile(path.join(directory, 'expected.g'))
    //assertIsEqual(text, expected);
});