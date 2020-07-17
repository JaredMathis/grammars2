const fs = require('fs');
const path = require('path');

const g = require('../../../index');

const {
    loadGrammar,
 } = require('../../../grammars');

const u = require('wlj-utilities');

u.scope(__filename, context => {
    let testDirectory = './tests/groups';
    let directory = path.join(testDirectory, 't1');
    let testGrammar = path.join(directory, 'actual.g');
    fs.copyFileSync(path.join(directory, 'input.g'), testGrammar);

    g.loadAndProver(testGrammar);

    let grammar = loadGrammar(testGrammar);

    u.assertIsEqualJson(() => grammar.rules, [{"left":"a","right":"aa"},{"left":"a","right":"aaa"},{"left":"a","right":"aaaa"}]);
});