const { execSync } = require('child_process');

const u = require('wlj-utilities');

u.scope(__filename, context => {
    const requires = [
        './library/prover',
        './grammars',
    ];
    
    let command = `
    browserify ${requires.map(f => '-r ' + f).join(' ')} > web/bundle.js
    `;

    u.merge(context, {command});
    u.executeCommand(command);
})
