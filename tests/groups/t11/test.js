const fs = require('fs');
const path = require('path');

const g = require('../../../index');
const {
    loadGrammar,
 } = require('../../../grammars');

 const u = require('wlj-utilities');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't11');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    g.loadAndProver(testGrammar);

    // Ensure grammar is valid
    loadGrammar(testGrammar);

    let text = u.readFile(testGrammar);
    let expected = u.readFile(path.join(directory, 'expected.g'))
    u.assertIsEqual(text, expected);
});