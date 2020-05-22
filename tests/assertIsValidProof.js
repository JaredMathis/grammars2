const {
    logIndent,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
} = require('../../utilities/all');

const {
    assertIsValidProof,
} = require('../grammars');

logIndent(__filename, context => {
    let i = 0;
    let rules;
    let proof;
    
    rules = [{left:'a',right:'aa'}];
    proof = ['a', 'aa', 'aaa'];
    assertIsValidProof(rules, proof);

    rules = [{left:'a',right:'b'}];
    proof = ['aaa', 'aab', 'bab', 'bbb'];
    assertIsValidProof(rules, proof);

    rules = [{left:'a',right:'b'},{left:'b', right:''}];
    proof = ['aaa', 'aab', 'bab', 'bbb', 'bb', 'b', ''];
    assertIsValidProof(rules, proof);
});