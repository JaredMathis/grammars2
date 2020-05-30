const u = require('wlj-utilities');

const {
    loadGrammar,
} = require('../grammars');

u.scope(__filename, context => {
    let grammars = [
        'a',
        'grow',
        'right',
        'increment',
    ];

    u.loop(grammars, g => {
        loadGrammar('grammars/'+g+'.g');
    }); 
});