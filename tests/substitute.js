const {
    logIndent,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqual,
    throws,
} = require('../../utilities/all');

const {
    substitute,
} = require('../grammars');

logIndent(__filename, context => {

    assertIsEqual(() => substitute('a', 'b', 'cad', 0), false);
    assertIsEqual(() => substitute('a', 'b', 'cad', 1), 'cbd');
    assertIsEqual(() => substitute('a', 'b', 'cad', 2), false);
    assertIsEqual(() => substitute('a', 'aa', 'a', 0), 'aa');
});