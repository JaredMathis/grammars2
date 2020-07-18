const u = require('wlj-utilities');

const parseGrammar = require('../library/parseGrammar');

u.scope(__filename, context => {
    let i = 0;
    u.merge(context, { i: i++ });
    parseGrammar(`
a aa

a
aa
aaa
`);

    // Can a grammar file learn grammar rules as it does proofs?
    parseGrammar(`
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

    parseGrammar(`
a b

aaa
aab
bab
bbb
`);

    parseGrammar(`
a b

aaa
aab
bab
bbb
`);
});