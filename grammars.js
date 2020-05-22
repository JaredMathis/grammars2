const {
    assert,
    logIndent,
    merge,
    loop,
    readFile,
} = require('./../utilities/all');

module.exports = {
    loadGrammar,
};

function loadGrammar(fileName) {
    let grammar = {};
    logIndent(loadGrammar.name, context => {
        grammar.rules = [];
        
        const text = readFile(fileName);
        let lines = text.split(`
`);
        loop(lines, line => {
            // There should be no double spaces.
            assert(() => line.indexOf('  ') < 0);
    
            // Skip lines that do not contain a space.
            if (line.indexOf(' ') < 0) {
                return;
            }
    
            let parts = line.split(' ');
            merge(context, {parts});
            assert(() => parts.length === 2);

            grammar.rules.push({ left: parts[0], right: parts[1]});
        });
    });

    return grammar;
}