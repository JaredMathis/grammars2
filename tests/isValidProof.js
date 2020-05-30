const u = require('wlj-utilities');

const {
    isValidProof,
} = require('../grammars');

u.scope(__filename, context => {
    let i = 0;
    let rules;
    let proof;
    
    rules = [{left:'a',right:'aa'}];
    proof = ['a', 'aa', 'aaa'];
    u.assert(() => isValidProof(rules, proof));

    rules = [{left:'a',right:'b'}];
    proof = ['aaa', 'aab', 'bab', 'bbb'];
    u.assert(() => isValidProof(rules, proof));

    rules = [{left:'a',right:'b'},{left:'b', right:''}];
    proof = ['aaa', 'aab', 'bab', 'bbb', 'bb', 'b', ''];
    u.assert(() => isValidProof(rules, proof));
});