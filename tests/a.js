const u = require('wlj-utilities');

const {
    loadGrammar,
} = require('../grammars');

u.scope(__filename, context => {
    let g = loadGrammar('grammars/a.g');
    u.merge(context, {g});
    u.assert(() => u.isDefined(g));
    u.assert(() => u.isArray(g.rules));
    u.assert(() => g.rules.length === 3);
    u.assert(() => u.isEqualJson(g.rules[0], {"left":"a1","right":"1a"}));
    u.assert(() => u.isEqualJson(g.rules[1], {"left":"a0","right":"b0"}));
});