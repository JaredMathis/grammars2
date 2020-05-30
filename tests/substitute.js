const u = require('wlj-utilities');

const {
    substitute,
} = require('../grammars');

u.scope(__filename, context => {

    u.assertIsEqual(() => substitute('a', 'b', 'cad', 0), false);
    u.assertIsEqual(() => substitute('a', 'b', 'cad', 1), 'cbd');
    u.assertIsEqual(() => substitute('a', 'b', 'cad', 2), false);
    u.assertIsEqual(() => substitute('a', 'aa', 'a', 0), 'aa');
});