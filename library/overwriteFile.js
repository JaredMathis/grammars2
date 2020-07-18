
const u = require("wlj-utilities");
const fs = require("fs");


module.exports = overwriteFile;


function overwriteFile(file, lines) {
    u.scope(overwriteFile.name, x => {
        fs.writeFileSync(file, '');
        u.loop(lines.split(u.EOL), line => {
            u.appendFileLine(file, line);
        });
    });
}