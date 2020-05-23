const {
    scope,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    loop,
} = require('./../../utilities/all');

const {
    loadGrammar,
} = require('../grammars');

scope(__filename, context => {
    let grammars = [
        'a',
        'grow',
        'right',
        'increment',
    ];

    loop(grammars, g => {
        loadGrammar('grammars/'+g+'.g');
    }); 
});