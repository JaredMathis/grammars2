
const u = require('wlj-utilities');

const proverStep = require('./proverStep');
const overwriteFile = require('./overwriteFile');
const prover = require('./prover');

module.exports = loadAndProver;

function loadAndProver(fileName, maxDepth) {
    let log = false;
    u.scope(loadAndProver.name, x => {
        let contents = u.readFile(fileName);

        contents = prover(contents, maxDepth);

        overwriteFile(fileName, contents);
    });
}