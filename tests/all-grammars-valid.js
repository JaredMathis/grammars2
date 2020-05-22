const {
    logIndent,
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

logIndent(__filename, context => {
    let grammars = [
        'a',
        'grow',
    ];

    loop(grammars, g => {
        loadGrammar('grammars/'+g+'.g');
    }); 
});