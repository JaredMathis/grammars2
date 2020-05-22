const {
    logIndent,
    assert,
    loop,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
} = require('../utilities/all');

const {
    loadGrammar,
    prove,
} = require('./grammars');

logIndent(__filename, context => {
    let file = './grammars/grow.g';

    let grammar = loadGrammar(file);

    console.log(JSON.stringify({grammar}, null, 2));
})