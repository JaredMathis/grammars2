const {
    logIndent,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
} = require('./../../utilities/all');

const {
    loadGrammar,
} = require('../grammars');

logIndent(__filename, context => {
    let g = loadGrammar('grammars/a.g');
    merge(context, {g});
    assert(() => isDefined(g));
    assert(() => isArray(g.rules));
    assert(() => g.rules.length === 2);
    assert(() => isEqualJson(g.rules[0], {"left":"a1","right":"1a"}));
    assert(() => isEqualJson(g.rules[1], {"left":"a0","right":"b0"}));
});