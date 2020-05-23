const {
    scope,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
} = require('../../utilities/all');

const {
    prove,
} = require('../grammars');

scope(__filename, context => {
    let rules;

    rules = [{left:'a',right:'aa'},{left:'a',right:'b'}];
    proof = ["a","aa","aaa","baa","bba","bbb"];
    assertIsEqualJson(() => prove(rules, 'a', 'bbb', 5), proof);

    rules = [{left:'a',right:'aa'}];
    proof = ['a','aa','aaa'];
    assertIsEqualJson(() => prove(rules, 'a', 'aaa', 10), proof);
});