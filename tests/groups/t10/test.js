const fs = require('fs');
const path = require('path');

const g = require('../../../index');
const {
    loadGrammar,
    trimProofs,
    formatFile,
 } = require('../../../grammars');

 const u = require('wlj-utilities');
const overwriteFile = require('../../../library/overwriteFile');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't10');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    let file = u.readFile(testGrammar);
    let { anyChanged, newContents } = trimProofs(file);
    file = newContents;
    file = formatFile(file);
    overwriteFile(testGrammar, file);

    let text = u.readFile(testGrammar);
    let expected = u.readFile(path.join(directory, 'expected.g'))
    u.assertIsEqual(text, expected);
});