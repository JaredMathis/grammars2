const u = require('wlj-utilities');

const {
    assertIsValidGrammarFile,
} = require('../grammars');

u.scope(__filename, context => {    
    let i = 0;
    u.merge(context, {i:i++});
    assertIsValidGrammarFile(`
a aa

a
aa
aaa
`);

// Can a grammar file learn grammar rules as it does proofs?
assertIsValidGrammarFile(`
a aa

a
aa
aaa

aa
aaaa
aaaaaa

aaaa
aaaaaaaa
aaaaaaaaaaaa
`);

    assertIsValidGrammarFile(`
a b

aaa
aab
bab
bbb
`);

    assertIsValidGrammarFile(`
a b

aaa
aab
bab
bbb
`);
});