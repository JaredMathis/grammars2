const fs = require('fs');
const path = require('path');

const prover = require('../../prover');
const {
    loadGrammar,
 } = require('../../grammars');

const {
    logIndent,
    assertIsEqualJson,
} = require('../../../utilities/all');

logIndent(__filename, context => {
    let directory = './tests/t1/';
    let testGrammar = path.join(directory, 'test.g');
    fs.copyFileSync(path.join(directory, 'before.g'), testGrammar);

    prover(testGrammar);

    let grammar = loadGrammar(testGrammar);

    assertIsEqualJson(() => grammar.rules, [{"left":"a","right":"aa"},{"left":"a","right":"aaa"},{"left":"a","right":"aaaa"}]);
});