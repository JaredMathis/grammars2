const u = require('wlj-utilities');

const {
    prove,
} = require('../grammars');

u.scope(__filename, context => {
    let rules;

    rules = [{left:'a',right:'aa'},{left:'a',right:'b'}];
    proof = ["a","aa","aaa","baa","bba","bbb"];
    u.assertIsEqualJson(() => prove(rules, 'a', 'bbb', 5), proof);

    rules = [{left:'a',right:'aa'}];
    proof = ['a','aa','aaa'];
    u.assertIsEqualJson(() => prove(rules, 'a', 'aaa', 10), proof);
});