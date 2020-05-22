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
    assertIsValidGrammarFile,
} = require('../grammars');

logIndent(__filename, context => {    
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
bb
b
`);
});