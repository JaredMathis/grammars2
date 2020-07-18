
const u = require("wlj-utilities");


module.exports = getLines;

function getLines(s) {
    let lines;
    u.scope(getLines.name, x => {
        u.merge(x, {s})
        u.assert(() => u.isString(s));

        lines = s.split(`
`);
        
    });
    return lines;
}
