require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const u = require("wlj-utilities");


module.exports = assertIsProofStep;

function assertIsProofStep(step) {
    u.scope(assertIsProofStep.name, context => {
        u.assert(() => u.isString(step));
    });
}

},{"wlj-utilities":18}],2:[function(require,module,exports){

const u = require("wlj-utilities");

const goalToken = "#goal";

module.exports = getGoalToken;

function getGoalToken() {
    return goalToken;
}

},{"wlj-utilities":18}],3:[function(require,module,exports){

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

},{"wlj-utilities":18}],4:[function(require,module,exports){

const u = require("wlj-utilities");
const assertIsProofStep = require("./assertIsProofStep");
const isValidSubstitution = require("./isValidSubstitution");


module.exports = isValidProof;

function isValidProof(rules, proof) {
    let result = true;
    let log = false;
    if (log) console.log('isValidProof entered', {rules, proof});
    u.scope(isValidProof.name, x => {
        u.merge(x, {rules});
        u.merge(x, {proof});

        u.assert(() => u.isArray(rules));
        u.assert(() => u.isArray(proof));
        u.loop(proof, step => {
            assertIsProofStep(step);
        })

        u.merge(x, {step:'processing proof steps'});
        u.loop(u.range(proof.length - 1, 1), (currentIndex) => {
            let validStep = false;

            let previousIndex = currentIndex - 1;
            u.merge(x, {previousIndex});

            let previous = proof[previousIndex];
            u.merge(x, {previous});

            let current = proof[currentIndex];            

            let allS = [];
            u.loop(u.range(previous.length), previousIndex => {
                u.loop(rules, rule => {
                    if (validStep) {
                        return true;
                    }
                    let s = isValidSubstitution(
                        previous, current, rule.left, rule.right, previousIndex);
                    allS.push(s);
                    u.merge(x, {s});
                    u.assert(() => !validStep);
                    validStep = s.valid;
                });
                if (validStep) {
                    return true;
                }
            });

            u.merge(x, {allS});
            u.merge(x, {validStep});

            if (!validStep) {
                result = false;
                return;
            }
        });
    });

    return result;
}
},{"./assertIsProofStep":1,"./isValidSubstitution":5,"wlj-utilities":18}],5:[function(require,module,exports){

const u = require("wlj-utilities");
const assertIsProofStep = require("./assertIsProofStep");


module.exports = isValidSubstitution;

function isValidSubstitution(previous, current, left, right, index) {
    let log = false;
    if (log) console.log('isValidSubstitution entered', {previous, current, left, right, index});

    let result = {};
    u.scope(isValidSubstitution.name, context => {
        u.merge(context, {previous});
        u.merge(context, {current});
        u.merge(context, {left});
        u.merge(context, {right});
        u.merge(context, {index});

        assertIsProofStep(previous);
        assertIsProofStep(current);
        assertIsProofStep(left);
        assertIsProofStep(right);
        u.assert(() => u.isInteger(index));

        // Leading up to the rule before and current should match.
        let previousBefore = previous.substring(0, index);
        u.merge(context, {previousBefore});
        let currentBefore = current.substring(0, index);
        u.merge(context, {currentBefore});
        if (previousBefore !== currentBefore) {
            result.valid = false;
            result.message = 'before does not match';
            return;
        }

        // The previous should match the rule left.
        let previousMatch = previous.substring(index, index + left.length);
        u.merge(context, {previousMatch});
        if (previousMatch !== left) {
            result.valid = false;
            result.message = 'left does not match previous';
            return;
        }

        // The current should match the rule right.
        let currentMatch = current.substring(index, index + right.length);
        u.merge(context, {currentMatch});
        if (currentMatch !== right) {
            result.valid = false;
            result.message = 'right does not match current';
            return;
        }

        // The afters should match.
        let previousAfter = previous.substring(index + left.length);
        u.merge(context, {previousAfter});
        let currentAfter = current.substring(index + right.length);
        u.merge(context, {currentAfter});
        if (previousAfter !== currentAfter) {
            result.valid = false;
            result.message = 'after does not match';
            return;
        }

        result.valid = true;
    });

    if (log) console.log({result});

    return result;
}
},{"./assertIsProofStep":1,"wlj-utilities":18}],6:[function(require,module,exports){

const u = require("wlj-utilities");
const getGoalToken = require("./getGoalToken");


module.exports = lineIsGoal;

function lineIsGoal(line) {
    let goal;

    u.scope(lineIsGoal.name, context => {
        u.assert(() => u.isString(line));

        if (!line.startsWith(getGoalToken())) {
            return false;
        }

        let parts = line.split(' ');
        let goalParts = parts.slice(1);
        u.assert(() => goalParts.length === 2);
        goal = {left: goalParts[0], right: goalParts[1]}; 
    });
    return goal;
}
},{"./getGoalToken":2,"wlj-utilities":18}],7:[function(require,module,exports){

const u = require("wlj-utilities");


module.exports = lineIsProofStep;

function lineIsProofStep(line) {
    return line.length > 0 && line.indexOf(' ') < 0;
}

},{"wlj-utilities":18}],8:[function(require,module,exports){

const u = require("wlj-utilities");
const getLines = require("./getLines");
const lineIsGoal = require("./lineIsGoal");
const lineIsProofStep = require("./lineIsProofStep");
const isValidProof = require("./isValidProof");


module.exports = parseGrammar;

/**
 * Checks for proof correctness,
 * Checks for... TODO
 * @param {*} fileContents 
 */
function parseGrammar(fileContents) {
    let log = false;
    if (log) console.log('parseGrammar entered');

    let proof;
    let grammar;

    u.scope(parseGrammar.name, x => {
        u.merge(x,{fileContents});
        grammar = {};
        grammar.rules = [];
        grammar.goals = [];
        proof = [];

        let lines = getLines(fileContents);

        u.merge(x, {step:'processing lines'})
        u.loop(lines, line => {
            if (log) console.log('processing line', { line });

            // There should be no double spaces.
            u.assert(() => line.indexOf('  ') < 0);

            let parts = line.split(' ');

            let goal;
            if (goal = lineIsGoal(line)) {
                grammar.goals.push(goal);
                return;
            }

            if (line === '') {
                checkProof();
                return;
            }

            // This is a proof step
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            }
    
            u.merge(x, {parts});
            u.assert(() => parts.length === 2);

            u.assert(() => parts[0].length >= 1);
            u.assert(() => parts[1].length >= 1);
            grammar.rules.push({ left: parts[0], right: parts[1]});
        });

        checkProof();

        // Make sure goals have not been proved.
        u.merge(x, {step:'already proved goals'})
        u.loop(grammar.goals, goal => {
            u.loop(grammar.rules, rule => {
                let goalAlreadyProved = goal.left === rule.left && goal.right === rule.right;
                u.merge(x, {goalAlreadyProved});
                u.assert(() => !goalAlreadyProved);
            });
        });

        function checkProof() {
            u.scope(checkProof.name, context => {
                if (log) console.log('checkProof entered', {proof});
                // If proof is empty, nothing to check
                if (proof.length === 0) {
                    return;
                }
        
                // If the proof is derivable from just first and last steps from previous
                // proofs, then this proof is redundant.
                let redundant = isValidProof(grammar.rules, [proof[0], u.arrayLast(proof)]);
                u.merge(context, {proof});
                u.assert(() => !redundant);
        
                let valid = isValidProof(grammar.rules, proof);
                u.assert(() => valid);
        
                // Add the first and last step of the proof as a new grammar rule.
                grammar.rules.push({left: proof[0], right: u.arrayLast(proof)});
        
                // Reset the proof.
                proof = [];
            });
        }
    });

    return grammar;
}

},{"./getLines":3,"./isValidProof":4,"./lineIsGoal":6,"./lineIsProofStep":7,"wlj-utilities":18}],9:[function(require,module,exports){

const u = require('wlj-utilities');

const {
    prove,
    addProofToFile,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    removeGoal,
    trimProofs,
} = require('../grammars');
const parseGrammar = require('./parseGrammar');

module.exports = proverStep;

let log = false;

function proverStep(file, maxDepth) {
    let provedGoal = false;
    let changed;

    grammar = parseGrammar(file);
    if (log) console.log(proverStep.name, { file });

    u.scope(proverStep.name, x => {

        u.loop(grammar.goals, goal=> {
            u.merge(x, {step: 'proving goal'});
            if (log) console.log('proving goal', { goal });
            let found = false;
            let proof;
            u.loop(u.range(maxDepth, 1), depth => {
                proof = prove(grammar.rules, goal.left, goal.right, depth);
                if (proof !== false) {
                    // The goal is proved in two steps; it doesn't
                    // need to be its own proof. Remove the goal.
                    if (proof.length === 2) {
                        file = removeGoal(file, goal.left, goal.right);
                    } else {
                        found = true;
                    }

                    return true;
                }
            });

            if (found) {
                provedGoal = true;
                changed = true;
                u.merge(x, {proof});
                u.merge(x, {step: 'proved goal'});
                if (log) console.log('proved goal', { goal });

                file = addProofToFile(file, proof);
                if (log) console.log(proverStep.name + ' added proof to file')
                u.merge(x, {step: 'added proof goal'});
                return true;
            } else {
                if (log) console.log('did not yet prove goal', { goal });
            }
        });

        u.merge(x, {step: 'max3ProofSteps'});
        file = max3ProofSteps(file);
        file = formatFile(file);

        u.merge(x, {step: 'trimProofs'});
        let { newContents, anyChanged } = trimProofs(file);
        file = newContents;
        if (anyChanged) {
            //trimProofsChanged = true;
        }
        file = formatFile(file);

        if (log) console.log(proverStep.name + ' trimmed ')
        if (log) console.log(file);

        u.merge(x, {step: 'removeRedundantProofs'});
        file = removeRedundantProofs(file);
        file = formatFile(file);
    });

    if (log) console.log(proverStep.name, {changed, file});

    return { newProvedGoal: provedGoal, newContents: file };
}
},{"../grammars":"/grammars","./parseGrammar":8,"wlj-utilities":18}],10:[function(require,module,exports){
"use strict";
/**
 * A response from a web request
 */
var Response = /** @class */ (function () {
    function Response(statusCode, headers, body, url) {
        if (typeof statusCode !== 'number') {
            throw new TypeError('statusCode must be a number but was ' + typeof statusCode);
        }
        if (headers === null) {
            throw new TypeError('headers cannot be null');
        }
        if (typeof headers !== 'object') {
            throw new TypeError('headers must be an object but was ' + typeof headers);
        }
        this.statusCode = statusCode;
        var headersToLowerCase = {};
        for (var key in headers) {
            headersToLowerCase[key.toLowerCase()] = headers[key];
        }
        this.headers = headersToLowerCase;
        this.body = body;
        this.url = url;
    }
    Response.prototype.isError = function () {
        return this.statusCode === 0 || this.statusCode >= 400;
    };
    Response.prototype.getBody = function (encoding) {
        if (this.statusCode === 0) {
            var err = new Error('This request to ' +
                this.url +
                ' resulted in a status code of 0. This usually indicates some kind of network error in a browser (e.g. CORS not being set up or the DNS failing to resolve):\n' +
                this.body.toString());
            err.statusCode = this.statusCode;
            err.headers = this.headers;
            err.body = this.body;
            err.url = this.url;
            throw err;
        }
        if (this.statusCode >= 300) {
            var err = new Error('Server responded to ' +
                this.url +
                ' with status code ' +
                this.statusCode +
                ':\n' +
                this.body.toString());
            err.statusCode = this.statusCode;
            err.headers = this.headers;
            err.body = this.body;
            err.url = this.url;
            throw err;
        }
        if (!encoding || typeof this.body === 'string') {
            return this.body;
        }
        return this.body.toString(encoding);
    };
    return Response;
}());
module.exports = Response;

},{}],11:[function(require,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var util = require('./utils');

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = util.assign(
    {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        }
    },
    Format
);

},{"./utils":15}],12:[function(require,module,exports){
'use strict';

var stringify = require('./stringify');
var parse = require('./parse');
var formats = require('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":11,"./parse":13,"./stringify":14}],13:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj; // eslint-disable-line no-param-reassign
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

},{"./utils":15}],14:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var formats = require('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        }).join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key') : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key');
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value'))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly,
            charset
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":11,"./utils":15}],15:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

},{}],16:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var handle_qs_js_1 = require("then-request/lib/handle-qs.js");
var GenericResponse = require("http-response-object");
var fd = FormData;
exports.FormData = fd;
function doRequest(method, url, options) {
    var xhr = new XMLHttpRequest();
    // check types of arguments
    if (typeof method !== 'string') {
        throw new TypeError('The method must be a string.');
    }
    if (url && typeof url === 'object') {
        url = url.href;
    }
    if (typeof url !== 'string') {
        throw new TypeError('The URL/path must be a string.');
    }
    if (options === null || options === undefined) {
        options = {};
    }
    if (typeof options !== 'object') {
        throw new TypeError('Options must be an object (or null).');
    }
    method = method.toUpperCase();
    options.headers = options.headers || {};
    // handle cross domain
    var match;
    var crossDomain = !!((match = /^([\w-]+:)?\/\/([^\/]+)/.exec(url)) && match[2] != location.host);
    if (!crossDomain)
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
    // handle query string
    if (options.qs) {
        url = handle_qs_js_1["default"](url, options.qs);
    }
    // handle json body
    if (options.json) {
        options.body = JSON.stringify(options.json);
        options.headers['content-type'] = 'application/json';
    }
    if (options.form) {
        options.body = options.form;
    }
    // method, url, async
    xhr.open(method, url, false);
    for (var name in options.headers) {
        xhr.setRequestHeader(name.toLowerCase(), '' + options.headers[name]);
    }
    // avoid sending empty string (#319)
    xhr.send(options.body ? options.body : null);
    var headers = {};
    xhr
        .getAllResponseHeaders()
        .split('\r\n')
        .forEach(function (header) {
        var h = header.split(':');
        if (h.length > 1) {
            headers[h[0].toLowerCase()] = h
                .slice(1)
                .join(':')
                .trim();
        }
    });
    return new GenericResponse(xhr.status, headers, xhr.responseText, url);
}
exports["default"] = doRequest;
module.exports = doRequest;
module.exports["default"] = doRequest;
module.exports.FormData = fd;

},{"http-response-object":10,"then-request/lib/handle-qs.js":17}],17:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var qs_1 = require("qs");
function handleQs(url, query) {
    var _a = url.split('?'), start = _a[0], part2 = _a[1];
    var qs = (part2 || '').split('#')[0];
    var end = part2 && part2.split('#').length > 1 ? '#' + part2.split('#')[1] : '';
    var baseQs = qs_1.parse(qs);
    for (var i in query) {
        baseQs[i] = query[i];
    }
    qs = qs_1.stringify(baseQs);
    if (qs !== '') {
        qs = '?' + qs;
    }
    return start + qs + end;
}
exports["default"] = handleQs;

},{"qs":12}],18:[function(require,module,exports){

const core = require('./library/core');
const log = require('./library/log');
const file = require('./library/file');
const tools = require('./library/tools');
const commandLine = require('./library/commandLine');

module.exports = {};
module.exports.merge = require("./library/merge.js");

module.exports.merge(module.exports, core);
module.exports.merge(module.exports, log);
module.exports.merge(module.exports, file);
module.exports.merge(module.exports, tools);
module.exports.merge(module.exports, commandLine);

module.exports.throws = require("./library/throws.js");
module.exports.assertIsJsonResponse = require("./library/assertIsJsonResponse.js");
module.exports.assertIsEqualJson = require("./library/assertIsEqualJson.js");
module.exports.assert = require("./library/assert.js");
module.exports.scope = require("./library/scope.js");
module.exports.propertiesToString = require("./library/propertiesToString.js");
module.exports.toQueryString = require("./library/toQueryString.js");
module.exports.propertiesAreEqualAndOnlyContainsProperties = require("./library/propertiesAreEqualAndOnlyContainsProperties.js");
module.exports.assertIsStringArray = require("./library/assertIsStringArray.js");
module.exports.assertOnlyContainsProperties = require("./library/assertOnlyContainsProperties.js");
module.exports.arrayExcept = require("./library/arrayExcept.js");
module.exports.isArray = require("./library/isArray.js");
module.exports.assertThrows = require("./library/assertThrows.js");
module.exports.arrayContainsDuplicates = require("./library/arrayContainsDuplicates.js");
module.exports.range = require("./library/range.js");
module.exports.isInteger = require("./library/isInteger.js");
module.exports.isString = require("./library/isString.js");
module.exports.isFunction = require("./library/isFunction.js");
module.exports.isSetEqual = require("./library/isSetEqual.js");
module.exports.config = require("./library/config.js");
module.exports.arraySingle = require("./library/arraySingle.js");
module.exports.propertiesAreEqual = require("./library/propertiesAreEqual.js");
module.exports.loop = require("./library/loop.js");
module.exports.stringTrimLambdaPrefix = require("./library/stringTrimLambdaPrefix.js");
module.exports.isDefined = require("./library/isDefined.js");
module.exports.isUndefined = require("./library/isUndefined.js");
module.exports.getUniqueFileName = require("./library/getUniqueFileName.js");
module.exports.EOL = require("./library/helpers.js").EOL;
module.exports.splitByEOL = require("./library/splitByEOL.js");
module.exports.assertIsString = require("./library/assertIsString.js");
module.exports.unwrapIfLambda = require("./library/unwrapIfLambda.js");
module.exports.assertIsStringArrayNested = require("./library/assertIsStringArrayNested.js");
module.exports.arraySequenceEquals = require("./library/arraySequenceEquals.js");
module.exports.assertIsArray = require("./library/assertIsArray.js");
module.exports.getAwsLambdaLogs = require("./library/getAwsLambdaLogs.js");
module.exports.executeCommand = require("./library/executeCommand.js");
module.exports.awsDeployLambda = require("./library/awsDeployLambda.js");
module.exports.getLibraryDirectoryName = require("./library/getLibraryDirectoryName.js");
module.exports.processExit = require("./library/processExit.js");
module.exports.truncateStringTo = require("./library/truncateStringTo.js");
module.exports.awsLambdaHelloWorld = require("./library/awsLambdaHelloWorld.js");
module.exports.arrayWhere = require("./library/arrayWhere.js");
module.exports.assertIsEqual = require("./library/assertIsEqual.js");
module.exports.getAwsApiGatewayFileName = require("./library/getAwsApiGatewayFileName.js");
module.exports.awsLambdaError = require("./library/awsLambdaError.js");
module.exports.awsScope = require("./library/awsScope.js");
module.exports.awsLambdaApiCall = require("./library/awsLambdaApiCall.js");
module.exports.isGuid = require("./library/isGuid.js");
module.exports.padNumber = require("./library/padNumber.js");
module.exports.args = require("./library/args.js");
},{"./library/args.js":19,"./library/arrayContainsDuplicates.js":20,"./library/arrayExcept.js":21,"./library/arraySequenceEquals.js":22,"./library/arraySingle.js":23,"./library/arrayWhere.js":24,"./library/assert.js":25,"./library/assertIsArray.js":26,"./library/assertIsEqual.js":27,"./library/assertIsEqualJson.js":28,"./library/assertIsJsonResponse.js":29,"./library/assertIsString.js":30,"./library/assertIsStringArray.js":31,"./library/assertIsStringArrayNested.js":32,"./library/assertOnlyContainsProperties.js":33,"./library/assertThrows.js":34,"./library/awsDeployLambda.js":35,"./library/awsLambdaApiCall.js":36,"./library/awsLambdaError.js":37,"./library/awsLambdaHelloWorld.js":38,"./library/awsScope.js":39,"./library/commandLine":40,"./library/config.js":41,"./library/core":42,"./library/executeCommand.js":43,"./library/file":44,"./library/getAwsApiGatewayFileName.js":45,"./library/getAwsLambdaLogs.js":46,"./library/getLibraryDirectoryName.js":47,"./library/getUniqueFileName.js":48,"./library/helpers.js":49,"./library/isArray.js":50,"./library/isDefined.js":51,"./library/isFunction.js":52,"./library/isGuid.js":53,"./library/isInteger.js":54,"./library/isSetEqual.js":55,"./library/isString.js":56,"./library/isUndefined.js":57,"./library/log":58,"./library/loop.js":59,"./library/merge.js":60,"./library/padNumber.js":61,"./library/processExit.js":62,"./library/propertiesAreEqual.js":63,"./library/propertiesAreEqualAndOnlyContainsProperties.js":64,"./library/propertiesToString.js":65,"./library/range.js":66,"./library/scope.js":67,"./library/splitByEOL.js":68,"./library/stringTrimLambdaPrefix.js":69,"./library/throws.js":70,"./library/toQueryString.js":71,"./library/tools":72,"./library/truncateStringTo.js":73,"./library/unwrapIfLambda.js":74}],19:[function(require,module,exports){
const assert = require('./assert');
const isFunction = require('./isFunction');
const scope = require('./scope');
const merge = require('./merge');

module.exports = args;

function args() {
    scope(args.name, x => {
        let expectedCount = arguments.length - 1;
        let a = arguments[0];
        merge(x, {a, expectedCount});

        assert(() => a.length === expectedCount);
        for (let i = 0; i < a.length; i++) {
            let type = arguments[i + 1]
            merge(x, () => a[i]);
            merge(x, {type});
            assert(() => isFunction(type), {arguments});
            assert(() => type(a[i]));
        }
    });
}
},{"./assert":25,"./isFunction":52,"./merge":60,"./scope":67}],20:[function(require,module,exports){

const scope = require("./scope");
const isArray = require("./isArray");
const assert = require("./assert");
const merge = require("./merge");
const range = require("./range");

module.exports = arrayContainsDuplicates;

function arrayContainsDuplicates(array) {
    let log = false;
    let result;
    scope(arrayContainsDuplicates.name, x => {
        merge(x,{array});
        assert(() => isArray(array));

        for (let i of range(array.length)) {
            merge(x,{i});
            for (let j of range(array.length)) {
                if (j <= i) {
                    continue;
                }

                if (array[i] === array[j]) {
                    if (log) console.log('arrayContainsDuplicates', { i,j })
                    result = true;
                    return;
                }
            }
        }

        if (log) console.log('arrayContainsDuplicates false');
        result = false;
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./merge":60,"./range":66,"./scope":67}],21:[function(require,module,exports){

const scope = require("./scope");
const isArray = require("./isArray");
const assert = require("./assert");

module.exports = arrayExcept;

function arrayExcept(array, except) {
    let result;
    scope(arrayExcept.name, x => {
        assert(() => isArray(array));
        assert(() => isArray(except));
        
        result = [];

        for (let a of array) {
            if (except.includes(a)) {
                continue;
            }
            result.push(a);
        }
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./scope":67}],22:[function(require,module,exports){

const scope = require("./scope");
const assertIsArray = require("./assertIsArray");
const range = require("./range");
const loop = require("./loop");

module.exports = arraySequenceEquals;

function arraySequenceEquals(a, b) {
    let result;
    scope(arraySequenceEquals.name, x => {
        assertIsArray(() => a);
        assertIsArray(() => b);

        if (a.length !== b.length) {
            result = false;
            return;
        }

        result = true;

        loop(range(a.length), i => {
            if (a[i] !== b[i]) {
                result = false;
                return true;
            }
        });
    });
    return result;
}

},{"./assertIsArray":26,"./loop":59,"./range":66,"./scope":67}],23:[function(require,module,exports){

const scope = require("./scope");
const loop = require("./loop");
const propertiesAreEqual = require("./propertiesAreEqual");
const merge = require("./merge");
const assert = require("./assert");
const isArray = require("./isArray");
const isDefined = require("./isDefined");

module.exports = arraySingle;

function arraySingle(array, matcher) {
    let result;
    scope(arraySingle.name, x => {
        merge(x,{array,matcher})
        assert(() => isArray(array));
        assert(() => isDefined(matcher));
        let found = false;
        let keys = Object.keys(matcher);
        merge(x,{keys})
        loop(array, a => {
            if (propertiesAreEqual(a, matcher, keys)) {
                merge(x,{result});
                assert(() => !found);
                result = a;
                found = true;
            }
        })
        let p = propertiesAreEqual(array[0], matcher, keys)
        merge(x,{p});
        assert(() => found);
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./isDefined":51,"./loop":59,"./merge":60,"./propertiesAreEqual":63,"./scope":67}],24:[function(require,module,exports){

const scope = require("./scope");
const merge = require("./merge");
const assert = require("./assert");
const isArray = require("./isArray");
const isDefined = require("./isDefined");
const loop = require("./loop");
const propertiesAreEqual = require("./propertiesAreEqual");

module.exports = arrayWhere;

function arrayWhere(array, matcher) {
    let result;
    scope(arrayWhere.name, x => {
        merge(x,{array,matcher})
        result = [];
        assert(() => isArray(array));
        assert(() => isDefined(matcher));
        let keys = Object.keys(matcher);
        merge(x,{keys})
        loop(array, a => {
            if (propertiesAreEqual(a, matcher, keys)) {
                merge(x,{result});
                result.push(a);
            }
        });
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./isDefined":51,"./loop":59,"./merge":60,"./propertiesAreEqual":63,"./scope":67}],25:[function(require,module,exports){

const scope = require("./scope");
const merge = require("./merge");
const isFunction = require("./isFunction");

module.exports = assert;

function assert(b) {
    let result;
    scope(assert.name, x => {
        merge(x, {b});

        let bValue;
        if (isFunction(b)) {
            delete x.b;
            merge(x, b);
            bValue = b();
        } else {
            bValue = b;
        }

        //merge(x, {bValue});
        if (bValue) {
            return;
        }

        throw new Error('assert failed');
    });
    return result;
}

},{"./isFunction":52,"./merge":60,"./scope":67}],26:[function(require,module,exports){

const scope = require("./scope");
const unwrapIfLambda = require("./unwrapIfLambda");
const assert = require("./assert");
const isArray = require("./isArray");
const merge = require("./merge");

module.exports = assertIsArray;

function assertIsArray(a) {
    let result;
    scope(assertIsArray.name, x => {
        merge(x, {a})
        let value = unwrapIfLambda(a);
        assert(() => isArray(value));
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./merge":60,"./scope":67,"./unwrapIfLambda":74}],27:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const merge = require("./merge");
const unwrapIfLambda = require("./unwrapIfLambda");

module.exports = assertIsEqual;

function assertIsEqual(a, b) {
    let result;
    scope(assertIsEqual.name, x => {
        merge(x, a);
        merge(x, b);
        assert(() => unwrapIfLambda(a) === unwrapIfLambda(b))
    });
    return result;
}

},{"./assert":25,"./merge":60,"./scope":67,"./unwrapIfLambda":74}],28:[function(require,module,exports){
const assert = require("./assert");
const scope = require('./scope');
const isDefined = require("./isDefined");
const isFunction = require("./isFunction");
const merge = require("./merge");

module.exports = assertIsEqualJson;

function assertIsEqualJson(left, right) {
    let result;
    scope(assertIsEqualJson.name, x => {
        merge(x, {left});
        merge(x, {right});

        let leftValue;
        if (isFunction(left)) {
            leftValue = left();
        } else {
            leftValue = left;
        }
        merge(x, {leftValue});

        let rightValue;
        if (isFunction(right)) {
            rightValue = right();
        } else {
            rightValue = right;
        }
        merge(x, {rightValue});

        assert(() => isDefined(left));
        assert(() => isDefined(right));
        assert(() => JSON.stringify(leftValue) === JSON.stringify(rightValue));
    });
    return result;
}

},{"./assert":25,"./isDefined":51,"./isFunction":52,"./merge":60,"./scope":67}],29:[function(require,module,exports){
const scope = require("./scope");
const assert = require("./assert");
const merge = require("./merge");
const isInteger = require("./isInteger");
const isFunction = require("./isFunction");
const isDefined = require("./isDefined");

module.exports = assertIsJsonResponse;

function assertIsJsonResponse(response, status, body) {
    let result;
    scope(assertIsJsonResponse.name, x => {
        merge(x, {response});
        merge(x, {status});
        merge(x, {body});

        assert(() => isDefined(response));
        assert(() => isInteger(status));
        assert(() => isDefined(body));
        
        assert(() => response.statusCode === status);
        assert(() => isDefined(response.body));
        assert(() => isFunction(response.body.toString));

        let actualJson = response.body.toString();
        merge(x, {actualJson});

        let expectedJson = JSON.stringify(body);
        merge(x, {expectedJson});

        assert(() => actualJson === expectedJson);
    });
    return result;
}

},{"./assert":25,"./isDefined":51,"./isFunction":52,"./isInteger":54,"./merge":60,"./scope":67}],30:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const isString = require("./isString");
const unwrapIfLambda = require("./unwrapIfLambda");
const merge = require("./merge");

module.exports = assertIsString;

function assertIsString(s) {
    let result;
    scope(assertIsString.name, x => {
        let value = unwrapIfLambda(s);
        merge(x, {value});
        assert(() => isString(value));
    });
    return result;
}

},{"./assert":25,"./isString":56,"./merge":60,"./scope":67,"./unwrapIfLambda":74}],31:[function(require,module,exports){

const assert = require("./assert");
const scope = require("./scope");
const isArray = require("./isArray");
const isString = require("./isString");
const merge = require("./merge");
const unwrapIfLambda = require("./unwrapIfLambda");
const loop = require("./loop");

module.exports = assertIsStringArray;

function assertIsStringArray(array) {
    let result;
    scope(assertIsStringArray.name, x => {
        merge(x, {array});
        let value = unwrapIfLambda(array);
        assert(() => isArray(value));

        loop(value, v => {
            assert(() => isString(v));
        });
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./isString":56,"./loop":59,"./merge":60,"./scope":67,"./unwrapIfLambda":74}],32:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const loop = require("./loop");
const isArray = require("./isArray");
const assertIsStringArray = require("./assertIsStringArray");
const merge = require("./merge");
const unwrapIfLambda = require("./unwrapIfLambda");

module.exports = assertIsStringArrayNested;

function assertIsStringArrayNested(input) {
    let result;
    scope(assertIsStringArrayNested.name, x => {
        merge(x,{input});
        let value = unwrapIfLambda(input);
        assert(() => isArray(value));
        
        loop(value, v => {
            assertIsStringArray(() => v);
        });
    });
    return result;
}

},{"./assert":25,"./assertIsStringArray":31,"./isArray":50,"./loop":59,"./merge":60,"./scope":67,"./unwrapIfLambda":74}],33:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const merge = require("./merge");
const assertIsStringArray = require("./assertIsStringArray");
const isDefined = require("./isDefined");

module.exports = assertOnlyContainsProperties;

function assertOnlyContainsProperties(object, properties) {
    let result;
    scope(assertOnlyContainsProperties.name, x => {
        merge(x, {object});
        merge(x, {properties});
        
        assert(() => isDefined(object));
        assertIsStringArray(properties);

        for (let key in object) {
            assert(() => properties.includes(key));
        }

        for (let property of properties) {
            assert(() => object.hasOwnProperty(property));
        }
    });
    return result;
}

},{"./assert":25,"./assertIsStringArray":31,"./isDefined":51,"./merge":60,"./scope":67}],34:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const throws = require("./throws");
const merge = require("./merge");

module.exports = assertThrows;

function assertThrows(lambda) {
    let result;
    scope(assertThrows.name, x => {
        merge(x, {lambda});
        assert(() => throws(lambda));
    });
    return result;
}

},{"./assert":25,"./merge":60,"./scope":67,"./throws":70}],35:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const getUniqueFileName = require('./getUniqueFileName');
const getLibraryDirectoryName = require('./getLibraryDirectoryName');
const executeCommand = require('./executeCommand');
const arrayWhere = require('./arrayWhere');
const merge = require('./merge');
const getAwsApiGatewayFileName = require('./getAwsApiGatewayFileName');
const { readFile } = require('./file');
const fs = require('fs');

const role = 'arn:aws:iam::491701175555:role/service-role/sandbox-role-0p3p32vk'

module.exports = awsDeployLambda;

function awsDeployLambda(args) {
    let result;
    scope(awsDeployLambda.name, x => {
        let output;
        let parsed;

        assert(() => args.length >= 1);
        let lambdaName = args[0];

        let fileName = getUniqueFileName('temp.zip');

        console.log('Zipping library and index.js to ' + fileName);

        output = executeCommand(`zip -r ${fileName} index.js node_modules ${getLibraryDirectoryName()}/`);

        output = executeCommand(`aws lambda list-functions`);
        parsed = JSON.parse(output);
        let lambdas = arrayWhere(parsed.Functions, { FunctionName: lambdaName });
        assert(() => lambdas.length <= 1);
        if (lambdas.length === 0) {
            console.log(`Lambda ${lambdaName} does not exist. Creating.`);
            output = executeCommand(`aws lambda create-function --function-name ${lambdaName} --runtime nodejs12.x --role ${role} --handler index.${lambdaName} --zip-file fileb://${fileName}`);
            console.log(`Lambda ${lambdaName} created.`);

            console.log('Deleting ' + fileName);
            fs.unlinkSync(fileName);

            output = executeCommand(`aws lambda list-functions`);
            parsed = JSON.parse(output);
            lambdas = arrayWhere(parsed.Functions, { FunctionName: lambdaName });
            assert(() => lambdas.length === 1);
            let lambda = lambdas[0];

            try {
                executeCommand(`aws lambda add-permission --function-name ${lambdaName} --action lambda:InvokeFunction --statement-id apigateway --principal apigateway.amazonaws.com`);
            } catch (e) {
                e = e.innerError || e;
                let message = e.toString();
                merge(x, { message });
                merge(x, () => Object.keys(e));
                assert(() => message.indexOf('The statement id (apigateway) provided already exists.') >= 0);
            }

            output = executeCommand(`aws apigateway get-rest-apis`)
            parsed = JSON.parse(output);
            let apis = arrayWhere(parsed.items, { name: lambdaName });
            assert(() => apis.length <= 1);
            if (apis.length === 0) {
                console.log(`Api ${lambdaName} does not exist. Creating.`)
                output = executeCommand(`aws apigateway create-rest-api --name ${lambdaName}`)
                parsed = JSON.parse(output);
                console.log(`Api ${lambdaName} created.`)
            }

            output = executeCommand(`aws apigateway get-rest-apis`)
            parsed = JSON.parse(output);
            apis = arrayWhere(parsed.items, { name: lambdaName });
            assert(() => apis.length === 1);
            let apiId = apis[0].id;

            output = executeCommand(`aws apigateway get-resources --rest-api-id ${apiId}`)
            parsed = JSON.parse(output);
            assert(() => parsed.items.length === 1);
            let resourceId = parsed.items[0].id;

            try {
                executeCommand(`aws apigateway get-method --rest-api-id ${apiId} --resource-id ${resourceId} --http-method POST`)
            } catch (e) {
                console.log('Method POST does not exist. Creating.')
                executeCommand(`aws apigateway put-method --rest-api-id ${apiId} --resource-id ${resourceId} --http-method POST --authorization-type "NONE"`)
            }

            executeCommand(`aws apigateway put-integration --rest-api-id ${apiId} --resource-id ${resourceId} --http-method POST --type AWS --integration-http-method POST --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${lambda.FunctionArn}/invocations --credentials ${role}`);

            try {
                executeCommand(`aws apigateway put-method-response --rest-api-id ${apiId} --resource-id ${resourceId} --http-method POST --status-code 200`);
            } catch (e) {
                e = e.innerError || e;
                let message = e.toString();
                merge(x, { message });
                merge(x, () => Object.keys(e));
                assert(() => message.indexOf('An error occurred (ConflictException) when calling the PutMethodResponse operation: Response already exists for this resource') >= 0);
            }

            executeCommand(`aws apigateway put-integration-response --rest-api-id ${apiId} --resource-id ${resourceId} --http-method POST --status-code 200 --selection-pattern ""`);

            const stage = "prod";
            executeCommand(`aws apigateway create-deployment --rest-api-id ${apiId} --stage-name ${stage}`);

            const file = './' + getAwsApiGatewayFileName();
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, "{}");
            }

            let json = readFile(file);
            parsed = JSON.parse(json);
            parsed[lambdaName] = {};
            if (!parsed[lambdaName][apiId]) {
                parsed[lambdaName]["default"] = apiId;
            }

            json = JSON.stringify(parsed, null, 2);
            fs.writeFileSync(file, json);
            
        } else {
            console.log(`Lambda ${lambdaName} exists. Updating.`);
            output = executeCommand(`aws lambda update-function-code --function-name ${lambdaName} --zip-file fileb://${fileName}`);
            console.log(`Lambda ${lambdaName} updated.`);

            console.log('Deleting ' + fileName);
            fs.unlinkSync(fileName);
        }

        console.log("");
        console.log(`${awsDeployLambda.name} Lambda and Gateway deploy ${lambdaName} success!`);
    });
    return result;
}

},{"./arrayWhere":24,"./assert":25,"./executeCommand":43,"./file":44,"./getAwsApiGatewayFileName":45,"./getLibraryDirectoryName":47,"./getUniqueFileName":48,"./merge":60,"./scope":67,"fs":75}],36:[function(require,module,exports){
(function (__filename){

const scope = require("./scope");
const assertIsString = require("./assertIsString");
const assert = require("./assert");
const merge = require("./merge");
const isDefined = require("./isDefined");
const request = require("sync-request");

module.exports = awsLambdaApiCall;

function awsLambdaApiCall(apigateway, lambdaName, jsonBody, context) {
    let result;
    scope(awsLambdaApiCall.name, x => {
        merge(x, { lambdaName });
        assertIsString(() => lambdaName);
        assert(() => isDefined(context));

        let apiId = apigateway[lambdaName]["default"];

        let response = request(
            'POST',
            `https://${apiId}.execute-api.us-east-1.amazonaws.com/prod`,
            {
                json: jsonBody || {},
            });
        let json = response.body.toString();
        merge(x, { json });
        let parsed = JSON.parse(json);
        merge(x, { parsed });
        try {
            parsed = JSON.parse(parsed);
        } catch (e) {
            console.log(__filename, { parsed });
            throw e;
        }
        merge(x, { parsed });

        assert(() => isDefined(parsed));
        result = parsed;

        if (parsed.success === false) {
            console.log(JSON.stringify({parsed}, null, 2));
        }
    });
    return result;
}

}).call(this,"/node_modules/wlj-utilities/library/awsLambdaApiCall.js")
},{"./assert":25,"./assertIsString":30,"./isDefined":51,"./merge":60,"./scope":67,"sync-request":16}],37:[function(require,module,exports){
const awsScope = require("./awsScope");
const merge = require("./merge");
const assert = require("./assert");

module.exports = awsLambdaError;

function awsLambdaError(event, context, callback) {
    awsScope(x => {
        merge(x, { asdf: 1234 });
        assert(false);
    }, callback);
}

},{"./assert":25,"./awsScope":39,"./merge":60}],38:[function(require,module,exports){

const awsScope = require("./awsScope");

module.exports = awsLambdaHelloWorld;

async function awsLambdaHelloWorld(event, context, callback) {
    await awsScope(async x => {
        if (event.name)
            return `Hello, ${event.name}`;
        return 'Hello, World!';
    }, callback);
}

},{"./awsScope":39}],39:[function(require,module,exports){

const scope = require("./scope");
const isFunction = require("./isFunction");
const assert = require("./assert");

module.exports = awsScope;

async function awsScope(lambda, callback) {
    let context = {};
    try {
        assert(() => isFunction(callback));
        
        let promise = lambda(context);

        let result = await Promise.resolve(promise)

        callback(null, JSON.stringify({
            success: true,
            context,
            result,
        }))
    } catch (e) {
        callback(null, JSON.stringify({
            success: false,
            context,
            error: {
                string: e.toString(),
                stack: e.stack,
                e,
            }
        }));
    }
}

},{"./assert":25,"./isFunction":52,"./scope":67}],40:[function(require,module,exports){
(function (process){
const isString = require('./isString');
const scope = require('./scope');
const assert = require('./assert');
const merge = require('./merge');
const isArray = require('./isArray');
const isInteger = require('./isInteger');
const isUndefined = require('./isUndefined');
const loop = require('./loop');
const getAwsLambdaLogs = require('./getAwsLambdaLogs');
const awsDeployLambda = require('./awsDeployLambda');
const { deleteDirectory } = require('./file');
const getLibraryDirectoryName = require('./getLibraryDirectoryName');

const fs = require('fs');
const path = require('path');
const { EOL } = require('os');

let verbose = false;

const defaultCommands = {
    functionCreate,
    functionTest,
    functionDelete,
    functionRename,
    getAwsLambdaLogs,
    awsDeployLambda,
}

module.exports = {
    commandLine,
    functionCreate,
    baseDirectory: '.',
    /** Whether or not this is the wlj-utilities NPM package */
    isWljUtilitiesPackage: false,
    defaultCommands,
};

function commandLine(commands) {
    scope(commandLine.name, x => {
        if (isUndefined(commands)) {
            commands = defaultCommands;
        }

        let command = commands[process.argv[2]];
        if (!command) {
            console.log('Please use a command-line argument.');
            console.log('Valid command-line arguments:');
            loop(Object.keys(commands), c => {
                console.log(c);
            });
            return;
        }

        let remaining = process.argv.slice(3);
        if (verbose) {
            console.log('Calling: ' + command.name);
            console.log('Args: ' + remaining);
        }
        let messages = [];
        command(remaining, messages);
        console.log(messages.join(EOL));
    });
}

const library = getLibraryDirectoryName();

function getFunctionName(args, messages, i) {
    let result;
    scope(getFunctionName.name, x => {
        merge(x, { args });
        assert(() => isArray(args));
        assert(() => isArray(messages));
        assert(() => isInteger(i));
        assert(() => 0 <= i);

        if (args.length < 1) {
            messages.push('Expecting at least 1 argument');
            return;
        }

        let fnName = args[i];
        assert(() => isString(fnName));
        result = fnName;
    });
    return result;
}

function getLibraryDirectory(messages) {
    let libDirectory = path.join(module.exports.baseDirectory, library);
    if (!fs.existsSync(libDirectory)) {
        fs.mkdirSync(libDirectory);
        messages.push('Created ' + libDirectory);
    }
    return libDirectory;
}

function getTestsDirectory() {
    let testsDirectory = path.join(module.exports.baseDirectory, 'tests');
    return testsDirectory;
}

function getFunctionTestsDirectory(messages, fnName) {
    let result;
    scope(getFunctionTestsDirectory.name, x => {
        let testsDirectory = getTestsDirectory(messages);
        if (!fs.existsSync(testsDirectory)) {
            fs.mkdirSync(testsDirectory);
            messages.push('Created ' + testsDirectory);
        }
    
        let fnTestDirectory = path.join(testsDirectory, fnName);
        result = fnTestDirectory;
    })
    return result;
}

function functionTest(args, messages) {
    let fnName = getFunctionName(args, messages, 0);

    let fnFile = getFunctionFile(messages, fnName);
    assert(() => fs.existsSync(fnFile));

    let fnTestDirectory = getFunctionTestsDirectory(messages, fnName);
    if (!fs.existsSync(fnTestDirectory)) {
        fs.mkdirSync(fnTestDirectory);
        messages.push('Created ' + fnTestDirectory);
    }

    let i = 1;
    let testFile;
    do {
        testFile = path.join(fnTestDirectory, i + '.js');
        i++;
    } while (fs.existsSync(testFile));
    assert(() => !fs.existsSync(testFile));
    fs.writeFileSync(testFile, `
const u = require("${module.exports.isWljUtilitiesPackage ? '../../index' : 'wlj-utilities'}");

const ${fnName} = require("../../${library}/${fnName}.js");
const index = require("../../index.js");

u.scope(__filename, x => {
    // TODO: Fix broken test
    u.assert(false);
});
`);
    assert(() => fs.existsSync(testFile));
    messages.push('Created ' + testFile);

    let allTestsFile = path.join(module.exports.baseDirectory, 'test.js');
    if (!fs.existsSync(allTestsFile)) {
        fs.writeFileSync(allTestsFile, '');
        messages.push('Created ' + allTestsFile);
    } else {
        messages.push('Modified ' + allTestsFile);
    }
    fs.appendFileSync(allTestsFile, EOL);
    fs.appendFileSync(allTestsFile, `require("./${testFile}");`)
}

function functionRename(args, messages) {
    let fromName = getFunctionName(args, messages, 0);
    let toName = getFunctionName(args, messages, 1);

    let fromFile = getFunctionFile(messages, fromName);
    let toFile = getFunctionFile(messages, toName);

    assert(() => fs.existsSync(fromFile));
    assert(() => !fs.existsSync(toFile));
    fs.renameSync(fromFile, toFile);
    messages.push(`Renamed from ${fromFile} to ${toFile}`);

    let fromTests = getFunctionTestsDirectory(messages, fromName);
    let toTests = getFunctionTestsDirectory(messages, toName);

    assert(() => fs.existsSync(fromTests));
    assert(() => !fs.existsSync(toTests));
    fs.renameSync(fromTests, toTests);
    messages.push(`Renamed from ${fromTests} to ${toTests}`);
}

function getFunctionFile(messages, fnName) {
    let result;
    scope(getFunctionFile.name, x => {
        merge(x, {messages});
        let libDirectory = getLibraryDirectory(messages);

        let fnFile = path.join(libDirectory, fnName + '.js');
        result = fnFile;
    })
    return result;
}

function functionCreate(args, messages) {
    scope(functionCreate.name, x => {
        merge(x, {messages});

        let fnName = getFunctionName(args, messages, 0);

        let fnFile = getFunctionFile(messages, fnName);
        merge(x, {fnFile});
        assert(() => !fs.existsSync(fnFile));
        fs.writeFileSync(fnFile, `
${module.exports.isWljUtilitiesPackage ? 'const scope = require("./scope");' : 'const u = require("wlj-utilities");'}
${module.exports.isWljUtilitiesPackage ? 'const args = require("./args");' : '' }

module.exports = ${fnName};

function ${fnName}() {
    let result;
    ${module.exports.isWljUtilitiesPackage ? '' : 'u.'}scope(${fnName}.name, x => {
        ${module.exports.isWljUtilitiesPackage ? '' : 'u.'}args(arguments);
        // TODO
    });
    return result;
}
`);
        assert(() => fs.existsSync(fnFile));
        messages.push('Created ' + fnFile);

        functionTest(args, messages);

        let indexFile = path.join(module.exports.baseDirectory, 'index.js');
        if (!fs.existsSync(indexFile)) {
            fs.writeFileSync(indexFile, 'module.exports = {};');
            messages.push('Created ' + indexFile);
        } else {
            messages.push('Modified ' + indexFile);
        }
        fs.appendFileSync(indexFile, EOL);
        fs.appendFileSync(indexFile, `module.exports.${fnName} = require("./library/${fnName}.js");`);
        messages.push('Finished');
    });
}

function functionDelete(args, messages) {
    scope(functionDelete.name, x => {
        let fnName = getFunctionName(args, messages, 0);

        let fnFile = getFunctionFile(messages, fnName);

        if (fs.existsSync(fnFile)) {
            fs.unlinkSync(fnFile);
            messages.push('Deleted ' + fnFile);
        } else {
            messages.push('Does not exist: ' + fnFile);
        }

        let fnTestDirectory = getFunctionTestsDirectory(messages, fnName);

        if (fs.existsSync(fnTestDirectory)) {
            deleteDirectory(fnTestDirectory);
            messages.push('Deleted ' + fnTestDirectory);
        } else {
            messages.push('Does not exist: ' + fnTestDirectory);
        }

        // TODO: modify index.js and test.js
    });
}
}).call(this,require('_process'))
},{"./assert":25,"./awsDeployLambda":35,"./file":44,"./getAwsLambdaLogs":46,"./getLibraryDirectoryName":47,"./isArray":50,"./isInteger":54,"./isString":56,"./isUndefined":57,"./loop":59,"./merge":60,"./scope":67,"_process":78,"fs":75,"os":76,"path":77}],41:[function(require,module,exports){

module.exports = {
    processExit: true,
    log: {
        scopeError: true,
    }
};
},{}],42:[function(require,module,exports){
const isUndefined = require('./isUndefined');
const isString = require('./isString');
const config = require('./config');

module.exports = {
    isEqualJson,
}

function isEqualJson(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
},{"./config":41,"./isString":56,"./isUndefined":57}],43:[function(require,module,exports){

const scope = require("./scope");
const { execSync } = require('child_process');

module.exports = executeCommand;

function executeCommand(command) {
    let result;
    scope(executeCommand.name, x => {
        console.log('Executing command: ' + command);
        let output = execSync(command);
        result = output.toString();
    });
    return result;
}

},{"./scope":67,"child_process":75}],44:[function(require,module,exports){
const scope = require('./scope');
const isString = require('./isString');
const isDefined = require('./isDefined');
const loop = require('./loop');
const merge = require('./merge');
const assert = require('./assert');
const assertIsEqual = require('./assertIsEqual');

const fs = require('fs');
const path = require('path');

module.exports = {
    readFile,
    getFiles,
    appendFileLine,
    copyFiles,
    deleteDirectory,
    getPackageVersion,
    bumpPackageVersion,
}

function assertFileExists(filePath) {
    scope(assertFileExists.name, x => {
        merge(x,{f: filePath});
        assert(() => fs.existsSync(filePath))
    });
}

function readFile(fileName) {
    return scope(readFile.name, context => {
        assertFileExists(fileName);

        merge(context, {fileName});
        let file = fs.readFileSync(fileName, 'utf8');
        return file;
    });
}

function getFiles(directoryName) {
    return scope(getFiles.name, context => {
        assertFileExists(directoryName);

        merge(context, {directoryName});
        let result = fs.readdirSync(directoryName);
        return result;
    });
}

function appendFileLine(file, line) {
    scope(appendFileLine.name, context => {
        assertFileExists(file);
        if (isDefined(line)) {
            assert(() => isString(line));
            if (line.length > 0) {
                fs.appendFileSync(file, line);
            }
        }
        fs.appendFileSync(file, `
`);
    });
}

function copyFiles(fromDirectory, toDirectory) {
    scope(copyFiles.name, context => {
        const fileNames = fs.readdirSync(fromDirectory);
    
        // Create the directory if it doesn't exist.
        if (!fs.existsSync(toDirectory)) {
            fs.mkdirSync(toDirectory);
        }

        loop(fileNames, fileName => {
            let src = path.join(fromDirectory, fileName);
            let dest = path.join(toDirectory, fileName);
            fs.copyFileSync(src, dest);
        });
    })
}

function deleteDirectory(directory) {
    scope(deleteDirectory.name, x => {
        merge(x, {directory});
        
        const fileNames = fs.readdirSync(directory);

        loop(fileNames, fileName => {
            let p = path.join(directory, fileName);
            fs.unlinkSync(p);
        });

        fs.rmdirSync(directory);
    });
}

const packageJson = 'package.json';

function getPackageVersion(packageDirectory) {
    let version;
    scope(getPackageVersion.name, x => {
        assert(() => isString(packageDirectory));
        let packagePath = path.join(packageDirectory, packageJson);

        let package = require(packagePath);

        version = package.version;
        merge(x, {version});
        assert(() => isDefined(version));
    })
    return version;
}

function bumpPackageVersion(packageDirectory) {
    let result;
    let log = false;
    scope(bumpPackageVersion.name, x => {
        assert(() => isString(packageDirectory));
        let version = getPackageVersion(packageDirectory);
        merge(x, {version});

        let parts = version.split('.');
        assertIsEqual(() => parts.length, 3);

        let build = parseInt(parts[2]);
        let nextBuild = build + 1;

        parts[2] = nextBuild;

        let nextVersion = parts.join('.');

        let packagePath = path.join(packageDirectory, packageJson);

        let package = require(packagePath);
        package.version = nextVersion;

        let json = JSON.stringify(package, null, 2);
        fs.writeFileSync(packagePath, json);
        if (log) console.log(`Updated version to ${nextVersion} in ` + packagePath);

        result = nextVersion;
    });
    return result;
}
},{"./assert":25,"./assertIsEqual":27,"./isDefined":51,"./isString":56,"./loop":59,"./merge":60,"./scope":67,"fs":75,"path":77}],45:[function(require,module,exports){

const scope = require("./scope");

module.exports = getAwsApiGatewayFileName;

function getAwsApiGatewayFileName() {
    let result;
    scope(getAwsApiGatewayFileName.name, x => {
        result = 'aws-apigateway.json';
    });
    return result;
}

},{"./scope":67}],46:[function(require,module,exports){

const scope = require("./scope");
const assertIsArray = require("./assertIsArray");
const assert = require("./assert");
const executeCommand = require("./executeCommand");
const getUniqueFileName = require('./getUniqueFileName');
const fs = require('fs');

module.exports = getAwsLambdaLogs;

function getAwsLambdaLogs(args, messages) {
    let result;
    scope(getAwsLambdaLogs.name, x => {
        assertIsArray(() => messages);
        assert(() => args.length >= 1);

        let lambdaName = args[0];
        let logGroupName = `/aws/lambda/${lambdaName}`;

        let json = executeCommand(`aws logs describe-log-streams --log-group-name ${logGroupName}`);
        let parsed = JSON.parse(json);

        // Get the most recently created log stream.
        parsed.logStreams.sort((a,b) => b.creationTime - a.creationTime);
        let logStream = parsed.logStreams[0];

        let logStreamName = logStream.logStreamName;

        let fileName = getUniqueFileName('temp.json');
        fs.writeFileSync(fileName, JSON.stringify({logGroupName,logStreamName}));
        json = executeCommand(`aws logs get-log-events --cli-input-json file://${fileName}`)
        fs.unlinkSync(fileName);

        parsed = JSON.parse(json);
        parsed.events;

        if (args[1] === '--events') {
            console.log(parsed.events);
        } else {
            for (let m of parsed.events.map(e => e.message)) {
                messages.push(m);
            }
        }
    });
    return result;
}

},{"./assert":25,"./assertIsArray":26,"./executeCommand":43,"./getUniqueFileName":48,"./scope":67,"fs":75}],47:[function(require,module,exports){

const scope = require("./scope");

module.exports = getLibraryDirectoryName;

function getLibraryDirectoryName() {
    let result;
    scope(getLibraryDirectoryName.name, x => {
        result = 'library'
    });
    return result;
}

},{"./scope":67}],48:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const isString = require("./isString");
const fs = require("fs");
const path = require("path");

module.exports = getUniqueFileName;

function getUniqueFileName(filePath) {
    let result;
    scope(getUniqueFileName.name, x => {
        if (!fs.existsSync(filePath)) {
            result = filePath;
            return;
        }
        let directory = path.dirname(filePath);
        let fileName = path.parse(filePath).name;
        let extension = path.extname(filePath);

        assert(() => isString(directory));
        assert(() => isString(fileName));
        assert(() => isString(extension));

        let i = 1;
        do {
            i++;
            result = path.join(directory, `${fileName}${i}${extension}`);
        } while (fs.existsSync(result));
    });
    return result;
}

},{"./assert":25,"./isString":56,"./scope":67,"fs":75,"path":77}],49:[function(require,module,exports){
(function (__filename){

const scope = require("./scope");
const merge = require("./merge");
const { EOL } = require('os');

scope(__filename, x => {
    module.exports = {};
    
    merge(module.exports, {EOL});
});

}).call(this,"/node_modules/wlj-utilities/library/helpers.js")
},{"./merge":60,"./scope":67,"os":76}],50:[function(require,module,exports){
module.exports = isArray;

function isArray(a) {
    return Array.isArray(a);
}
},{}],51:[function(require,module,exports){

const isUndefined = require("./isUndefined");

module.exports = isDefined;

function isDefined(a) {
    return !isUndefined(a);
}

},{"./isUndefined":57}],52:[function(require,module,exports){
module.exports = isFunction;

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
},{}],53:[function(require,module,exports){

const scope = require("./scope");
const assertIsString = require("./assertIsString");

module.exports = isGuid;

const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function isGuid(input) {
    let result;
    scope(isGuid.name, x => {
        assertIsString(() => input);

        result = regex.test(input);
    });
    return result;
}

},{"./assertIsString":30,"./scope":67}],54:[function(require,module,exports){

const scope = require("./scope");

module.exports = isInteger;

function isInteger(a) {
    let result;
    scope(isInteger.name, x => {
        result = parseInt(a, 10) === a;
    });
    return result;
}

},{"./scope":67}],55:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const isArray = require("./isArray");

module.exports = isSetEqual;

function isSetEqual(a, b) {
    let result;
    scope(isSetEqual.name, x => {
        assert(() => isArray(a));
        assert(() => isArray(b));

        result = isSubset(a, b)
            && isSubset(b, a);

        function isSubset(a, b) {
            for (let i of a) {
                if (!b.includes(i)) {
                    return false;
                }
            }
            return true;
        }
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./scope":67}],56:[function(require,module,exports){

module.exports = isString;

function isString(s) {
    let result = (s + "") === s;
    return result;
}

},{}],57:[function(require,module,exports){
module.exports = isUndefined;

function isUndefined(a) {
    return typeof a === 'undefined';
}
},{}],58:[function(require,module,exports){
const {
    processExit,
    isUndefined,
    isFunction,
} = require('./core');

module.exports = {
    consoleLog,
    logProperties,
}

// TODO: Validate arguments of framework

let indent = 0;

let context = {};

function isString(o) {
    return o.toString() === o;
}

function getPrefix(offset) {
    offset = offset || 0;

    let tab = "  ";
    let prefix = "";
    for (let i = 0; i < indent - offset; i++) {
        prefix += tab;
    }
    return prefix;
}

/**
 * Does something special if the property name is "parent".
 */
function logProperties(object, offset) {
    offset = offset || 0;
    let parent = '$parent';
    let name = '$name';

    let log = false;
    if (log) console.log('logProperties entered', {object});

    let prefix = getPrefix(offset);

    if (object.hasOwnProperty(parent)) {
        logProperties(object[parent], offset + 1);
    }

    if (object.hasOwnProperty(name)) {
        console.log(getPrefix(offset + 1) + object[name] + ' entered');
    }

    const maxCharacters = 120;
    for (let property in object) {
        if (log) console.log('logProperties', {property});
        if ([parent, name].includes(property)) {
            continue;
        }

        let o = {};
        o[property] = object[property];

        if (isFunction(o[property])) {
            o[property] = o[property].toString();
        }

        let json = JSON.stringify(o);
        if (log) console.log('logProperties', {json});
        if (log) console.log('logProperties', {keys:Object.keys(o)});

        let trimmed = truncateStringTo(json, maxCharacters);
        console.log(prefix + trimmed);
    }    
}

function scope(name, lambda) {
    let log = false;
    if (log) console.log('scope entered');
    if (log) consoleLog(name + " entered");

    let result;

    indent++;
    let oldContext = context;
    newContext = {};
    newContext.$name = name; 
    newContext.$parent = oldContext;
    context = newContext;
    try {
        result = lambda(context);
    } catch (e) {
        console.log('scope error');
        logProperties(context);
        console.log(e);
        processExit();
    }
    context = oldContext;
    indent--;

    if (log) consoleLog(name + " leaving");

    return result;
}

function consoleLog(message) {
    let log = false;
    let verbose = false;
    if (log) console.log('consoleLog entered');

    if (indent < 0) {
        if (verbose)
        if (log) console.log('indent negative');
        console.log('consoleLog error');
        console.log('need to call consoleLog inside scope');
        processExit();
    } else {
        if (verbose)
        if (log) console.log('indent not negative');
    }

    if (isString(message)) {
        if (verbose)
        if (log) console.log('message is string');
        let prefix = getPrefix();
        if (log) prefix = "message: " + prefix;
        console.log(prefix + message);

    } else {
        if (log) console.log('message is not string');
        logProperties(message);
    }

    if (log) console.log('consoleLog leaving');
}
},{"./core":42}],59:[function(require,module,exports){

const scope = require("./scope");
const merge = require("./merge");
const isFunction = require("./isFunction");
const assert = require("./assert");
const isArray = require("./isArray");

module.exports = loop;

function loop(array, lambda) {
    let result;

    let log = false;
    scope(loop.name, context => {
        merge(context, {array});
        merge(context, {lambda});

        assert(() => isArray(array));
        assert(() => isFunction(lambda));
    
        for (let index = 0; index < array.length; index++) {
            merge(context, {index});
            let element = array[index];
            merge(context, {element});
            let breakLoop = lambda(element, index);
            if (breakLoop) {
                break;
            }
        }
    });
    return result;
}

},{"./assert":25,"./isArray":50,"./isFunction":52,"./merge":60,"./scope":67}],60:[function(require,module,exports){
const isUndefined = require('./isUndefined')
const isFunction = require('./isFunction')
const stringTrimLambdaPrefix = require('./stringTrimLambdaPrefix');

module.exports = merge;

/**
 * Does something special with undefined.
 * Does something special if b is a function.
 * @param {*} a 
 * @param {*} b 
 */
function merge(a, b) {
    if (isUndefined(a)) {
        throw new Error('merge received undefined first argument');
    }
    if (isUndefined(b)) {
        throw new Error('merge received undefined second argument');
    }
    let bValue;
    if (isFunction(b)) {
        bValue = {};
        let key = stringTrimLambdaPrefix(b.toString());
        bValue[key] = b();
    } else {
        bValue = b;
    }
    for (let key in bValue) {
        a[key] = bValue[key];
        if (isUndefined(a[key])) {
            a[key] = '[undefined]';
        }
    }
}

},{"./isFunction":52,"./isUndefined":57,"./stringTrimLambdaPrefix":69}],61:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const isInteger = require("./isInteger");

module.exports = padNumber;

function padNumber(n, width, z) {
    let result;
    scope(padNumber.name, x => {
        assert(() => isInteger(n));
        assert(() => n >= 0);
        assert(() => isInteger(width));
        assert(() => width >= 0);

        z = z || '0';
        n = n + '';
        result = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    });
    return result;
}

},{"./assert":25,"./isInteger":54,"./scope":67}],62:[function(require,module,exports){
(function (process){

const scope = require("./scope");
const config = require("./config");

module.exports = processExit;

function processExit() {
    let log = false;
    if (log) {
        let stack = new Error().stack;
        console.log(stack);
    }
    if (config.processExit) {
        console.log('Calling process.exit(1)');
        process.exit(1);
    } else {
        console.log('config.processExit is false; Not calling process.exit(1)');
    }
}

}).call(this,require('_process'))
},{"./config":41,"./scope":67,"_process":78}],63:[function(require,module,exports){

const scope = require("./scope");
const assertIsStringArray = require("./assertIsStringArray");
const merge = require("./merge");
const loop = require("./loop");

module.exports = propertiesAreEqual;

function propertiesAreEqual(a, b, properties) {
    let result;
    scope(propertiesAreEqual.name, x => {
        merge(x, {a,b,properties});
        assertIsStringArray(properties);

        result = true;
        loop(properties, property => {
            let equal = a[property] === b[property];
            if (!equal) {
                result = false;
                return true;
            }
        });
    });
    return result;
}

},{"./assertIsStringArray":31,"./loop":59,"./merge":60,"./scope":67}],64:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const assertOnlyContainsProperties = require("./assertOnlyContainsProperties");
const assertIsStringArray = require("./assertIsStringArray");
const propertiesAreEqual = require("./propertiesAreEqual");

module.exports = propertiesAreEqualAndOnlyContainsProperties;

function propertiesAreEqualAndOnlyContainsProperties(a, b, properties) {
    let result;
    scope(propertiesAreEqualAndOnlyContainsProperties.name, x => {
        assertOnlyContainsProperties(a, properties);
        assertOnlyContainsProperties(b, properties);
        
        result = propertiesAreEqual(a, b, properties);
    });
    return result;
}

},{"./assert":25,"./assertIsStringArray":31,"./assertOnlyContainsProperties":33,"./propertiesAreEqual":63,"./scope":67}],65:[function(require,module,exports){
const isFunction = require('./isFunction');
const isUndefined = require('./isUndefined');
const truncateStringTo = require('./truncateStringTo');

module.exports = propertiesToString;

function propertiesToString(object, prefix) {
    if (isUndefined(prefix)) {
        prefix = '';
    }

    let result;

    result = [];

    const maxCharacters = 120;
    for (let property in object) {
        let o = {};
        o[property] = object[property];

        if (isFunction(o[property])) {
            o[property] = o[property].toString();
        }

        let json = JSON.stringify(o);
        let trimmed = truncateStringTo(json, maxCharacters);

        result.push(prefix + trimmed);
    }
    return result;
}

},{"./isFunction":52,"./isUndefined":57,"./truncateStringTo":73}],66:[function(require,module,exports){

const scope = require("./scope");
const isUndefined = require("./isUndefined");
const merge = require("./merge");
const assert = require("./assert");
const isInteger = require("./isInteger");

module.exports = range;

function range(count, start) {
    let result;
    scope(range.name, x => {
        merge(x,{count});
        merge(x,{start});
        assert(() => isInteger(count));
        assert(() => count >= 0);
        if (isUndefined(start)) {
            start = 0;
        }
        
        result = [];
        let max = start + count - 1;
        for (let i = start; i <= max; i++) {
            result.push(i);
        }
    });
    return result;
}

},{"./assert":25,"./isInteger":54,"./isUndefined":57,"./merge":60,"./scope":67}],67:[function(require,module,exports){
const isString = require("./isString");
const isFunction = require("./isFunction");
const processExit = require("./processExit");
const propertiesToString = require("./propertiesToString");
const config = require("./config");

module.exports = scope;

let count = 0;

function scope(name, lambda) {
    count++;

    let result;
    
    if (!isString(name)) {
        error(scope.name, 'Expecting name to be string');
    }
    if (!isFunction(lambda)) {
        error(scope.name, 'Expecting lambda to be function');
    }

    const x = {};
    try {
        result = lambda(x);
    } catch (e) {
        count--;

        if (count === 0) {
            let messages = [];

            let indent = '  ';
            messages.push(name + ' entered');
            let properties = propertiesToString(x, indent);
            for (let p of properties) {
                messages.push(p);
            }

            let current = e;
            while ((current instanceof ScopeError)) {
                messages.push(indent + current.name + ' entered');
                indent += '  '
                let properties = propertiesToString(current.context, indent);
                for (let p of properties) {
                    messages.push(p);
                }
                current = current.innerError;
            }
            //if (config.log.scopeError) console.log(current);

            throw new ScopeError(name, messages, current);
        } else {
            throw new ScopeError(name, x, e);
        }
    }

    count--;

    return result;
}

function error(name, message) {
    throw new Error(`Error: ${name}: ${message}`)
}

function ScopeError(name, context, innerError) {
    this.name = name;
    this.context = context;
    this.innerError = innerError;
}

//ScopeError.prototype = new Error();
},{"./config":41,"./isFunction":52,"./isString":56,"./processExit":62,"./propertiesToString":65}],68:[function(require,module,exports){

const scope = require("./scope");
const assertIsString = require("./assertIsString");
const helpers = require('./helpers');

module.exports = splitByEOL;

function splitByEOL(text) {
    let result;
    scope(splitByEOL.name, x => {
        assertIsString(() => text);
        result = text.split(helpers.EOL);
    });
    return result;
}

},{"./assertIsString":30,"./helpers":49,"./scope":67}],69:[function(require,module,exports){

const scope = require("./scope");

module.exports = stringTrimLambdaPrefix;

function stringTrimLambdaPrefix(s) {
    let result = s;

    result = result.trim();

    let parenthesis = "()";
    if (result.startsWith(parenthesis)){
        result = result.substring(parenthesis.length); 
    }
    result = result.trim();

    let arrow = "=>";

    if (result.startsWith(arrow)){
        result = result.substring(arrow.length); 
    }
    result = result.trim();

    return result;
}

},{"./scope":67}],70:[function(require,module,exports){
const scope = require("./../library/scope");
const assert = require("./../library/assert");
const isFunction = require("./../library/isFunction");

module.exports = throws;

function throws(lambda) {
    let result;
    scope(throws.name, x => {
        assert(() => isFunction(lambda));
        try {
            lambda();
            result = false;
            return;
        } catch (e) {
            result = true;
            return;
        }
    });
    return result;
}

},{"./../library/assert":25,"./../library/isFunction":52,"./../library/scope":67}],71:[function(require,module,exports){

const scope = require("./scope");
const assert = require("./assert");
const merge = require("./merge");
const isDefined = require("./isDefined");
const isString = require("./isString");

module.exports = toQueryString;

function toQueryString(object) {
    let result;
    scope(toQueryString.name, x => {
        merge(x, {object});
        assert(() => isDefined(object));

        result = '';
        let first = true;
        for (let key in object) {
            merge(x, {key});
            if (first) {
                result += "?";
                first = false;
            } else {
                result += '&';
            }
            result += key;
            let value = object[key];
            merge(x, {value});
            assert(() => isString(value));
            result += '=';
            result += value;
        }
    });
    return result;
}

},{"./assert":25,"./isDefined":51,"./isString":56,"./merge":60,"./scope":67}],72:[function(require,module,exports){
const isInteger = require('./isInteger');
const isDefined = require('./isDefined');
const merge = require('./merge');
const assert = require('./assert');
const isArray = require('./isArray');
const isString = require('./isString');
const scope = require('./scope');
const loop = require('./loop');

module.exports = {
    toDictionary,
    isArrayIndex,
    arrayLast,
    arrayAll,
    arraySome,
    isDistinct,
    loopPairs,
    arrayMax,
    arrayMin,
    arrayCount,
    arrayMin,
    stringSuffix,
};


function toDictionary(array, property) {
    let result = {};

    scope(toDictionary.name, context => {
    
        loop(array, a => {
            let key = a[property];
            merge(context, {key});
            assert(() => isDefined(key));
    
            if (result[key]) {
                throw new Error('Duplicate key');
            }
            result[key] = a; 
        });
    })

    return result;
}

function isArrayIndex(array, index) {
    let result;
    scope(isArrayIndex.name, x => {
        merge(x,{array});
        merge(x,{index});
        let ia = isArray(array);
        merge(x,{ia});
        let is = isString(array);
        merge(x,{is});
        assert(() => ia || is);
        let ii = isInteger(index);
        merge(x,{ii});
        assert(() => ii);
        let lower = 0 <= index;
        let upper = index < array.length;
        merge(x,{lower});
        merge(x,{upper});
        result = lower && upper;
    });
    return result;
}

function arrayLast(array) {
    assert(() => isArray(array) || isString(array));
    return array[array.length - 1];
}
function arrayMax(array) {
    let max;

    scope(arrayAll.name, context => {
        assert(() => isArray(array));
        
        max = array[0]

        loop(array, a => {
            if (a > max) {
                max = a;
            }
        })
    });

    return max;
}
function arrayMin(array) {
    let min;

    scope(arrayAll.name, context => {
        assert(() => isArray(array));
        
        min = array[0]

        loop(array, a => {
            if (a < min) {
                min = a;
            }
        })
    });

    return min;
}

/**
 * Returns true if array is empty
 * or if predicate is true for each element
 * of the array
 * @param {*} array 
 * @param {*} predicate 
 */
function arrayAll(array, predicate) {
    let success = true;

    scope(arrayAll.name, context => {
        assert(() => isArray(array));

        loop(array, a => {
            if (!predicate(a)) {
                success = false;
                return true;
            }
        })
    });

    return success;
}

/**
 * Returns false if array is empty
 * or if predicate is true for some element
 * of the array
 * @param {*} array 
 * @param {*} predicate 
 */
function arraySome(array, predicate) {
    let success = false;

    scope(arraySome.name, context => {
        assert(() => isArray(array));

        loop(array, a => {
            if (predicate(a)) {
                success = true;
                return true;
            }
        })
    });

    return success;
}

function loopPairs(array, lambda) {
    scope(loopPairs.name, context => {
        loop(array, (a, i) => {
            let result;
            loop(array, (b, j) => {
                if (j <= i) {
                    return;
                }
    
                result = lambda(a, b);
                if (result) {
                    return true;
                }
            });
            if (result) {
                return true;
            }
        });
    });
}

function isDistinct(array) {
    let success = true;

    scope(isDistinct.name, context => {
        assert(() => isArray(array));

        loopPairs(array, (a, b) => {
            if (a === b) {
                success = false;
            }
        });
    });

    return success;
}


function arrayCount(array, predicate) {
    let count = 0;

    scope(arrayCount.name, context => {
        assert(() => isArray(array));

        loop(array, a => {
            if (predicate(a)) {
                count++;
            }
        })
    });

    return count;
}

function stringSuffix(string, count) {
    let result;
    scope(stringSuffix.name, context => {
        assert(() => isString(string));

        assert(() => isInteger(count));
        assert(() => 0 <= count);
        assert(() => count <= string.length);

        result = string.substring(string.length - count);
    });
    return result;
}
},{"./assert":25,"./isArray":50,"./isDefined":51,"./isInteger":54,"./isString":56,"./loop":59,"./merge":60,"./scope":67}],73:[function(require,module,exports){

const scope = require("./scope");

module.exports = truncateStringTo;

function truncateStringTo(string, maxCharacters) {
    let ellipses = "...";
    if (string.length > maxCharacters) {
        string = string.substring(0, maxCharacters - ellipses.length);
        string += ellipses;
    }
    return string;
}
},{"./scope":67}],74:[function(require,module,exports){

const scope = require("./scope");
const isFunction = require("./isFunction");

module.exports = unwrapIfLambda;

function unwrapIfLambda(input) {
    let result;
    scope(unwrapIfLambda.name, x => {
        if (isFunction(input)) {
            result = input();
        } else {
            result = input;
        }
    });
    return result;
}

},{"./isFunction":52,"./scope":67}],"/grammars":[function(require,module,exports){
const u = require('wlj-utilities');

const fs = require('fs');
const parseGrammar = require('./library/parseGrammar');
const assertIsProofStep = require('./library/assertIsProofStep');
const getLines = require('./library/getLines');
const getGoalToken = require('./library/getGoalToken');
const lineIsProofStep = require('./library/lineIsProofStep');
const isValidProof = require('./library/isValidProof');

module.exports = {
    loadGrammar,
    substitute,
    prove,
    addProofToFile,
    removeGoal,
    breakUpProof,
    max3ProofSteps,
    formatFile,
    removeRedundantProofs,
    trimProofs,
    
};

function loadGrammar(fileName) {
    let grammar;

    u.scope(loadGrammar.name, context => {
        u.merge(context, {fileName});
        const fileContents = u.readFile(fileName);
        grammar = parseGrammar(fileContents);
    });

    return grammar;
}

function lineIsRule(line) {
    let result;
    u.scope(lineIsRule.name, context => {
        u.assert(() => u.isString(line));

        let parts = line.split(' ');
        if (parts.length !== 2) {
            return false;
        }

        result ={
            left: parts[0],
            right: parts[1],
        }
    })

    return result;
}

function assertIsProof(proof) {
    u.scope(assertIsProof.name, context => {
        u.merge(context, {proof});

        u.assert(() => u.isArray(proof));
        u.loop(proof, p => {
            assertIsProofStep(p);
        })
    });
}

function substitute(left, right, previous, index) {
    let result;

    u.scope(substitute.name, context=> {
        u.merge(context, {left});
        u.merge(context, {right});
        u.merge(context, {previous});
        u.merge(context, {index});

        assertIsProofStep(left);
        assertIsProofStep(right);
        assertIsProofStep(previous);
        u.assert(() => u.isArrayIndex(previous, index));

        if (index + left.length > previous.length) {
            result = false;
            return;
        }

        let actualLeft = previous.substring(index, index + left.length);
        u.merge(context, {actualLeft});
        u.assert(() => actualLeft.length === left.length);
        if (actualLeft !== left) {
            result = false;
            return;
        }

        let remaining = previous.substring(index + left.length);

        let before = previous.substring(0, index);
        result = before + right + remaining;
    });

    return result;
}

function assertIsGrammarRules(rules) {
    u.scope(assertIsGrammarRules.name, context => {
        u.merge(context, {rules});
        u.assert(() => u.isArray(rules));
        u.loop(rules, r => {
            u.assert(() => u.isDefined(r));
            assertIsProofStep(r.left);
            assertIsProofStep(r.right);
        });
    });
}

function prove(rules, start, goal, depth, proof) {
    let log = false;
    if (log) console.log('prove entered', {depth});
    let found = false;
    u.scope(prove.name, x => {
        u.merge(x, {rules});
        u.merge(x, {start});
        u.merge(x, {goal});
        u.merge(x, {depth});
        u.merge(x, {proof});

        assertIsGrammarRules(rules);
        assertIsProofStep(start);
        assertIsProofStep(goal);
        // We don't need to prove our premise.
        u.assert(() => start !== goal);
        u.assert(() => u.isInteger(depth));
        u.assert(() => 0 <= depth);
        if (u.isUndefined(proof)) {
            proof = [];
            proof.push(start);
        }
        assertIsProof(proof);

        u.loop(u.range(start.length), index => {
            if (found) {
                return true;
            }
            u.loop(rules, rule => {
                if (found) {
                    return true;
                }
                let s = substitute(rule.left, rule.right, start, index);
                if (s === false) {
                    return;
                }
                proof.push(s);
                if (s === goal) {
                    if (log) console.log('found', {s, proof});
                    found = true;
                    return;
                }
                if (depth > 1) {
                    if (log) console.log('calling prove');
                    let result = prove(rules, s, goal, depth-1, proof);
                    if (log) console.log('called prove', { result });
                    if (result !== false) {
                        found = true;
                        return;
                    }
                }
                proof.pop();
                if (log) console.log({ depth, proof })
            });
        });
    });

    if (log) console.log('prove leaving', { depth, proof });

    if (found) {
        return proof;
    }

    return false;
}

function addProofToFile(file, proof) {
    u.scope(addProofToFile.name, context => {
        // Add the proof.
        file += u.EOL
        u.loop(proof, p => {
            file += u.EOL
            file += p;
        });

        file = removeGoal(file, proof[0], u.arrayLast(proof));

        // Make sure proofs in file are valid.
        let grammar = parseGrammar(file);

        // Make sure last proof is the proof we added
        let lastRule = u.arrayLast(grammar.rules);
        u.merge(context, { lastRule });
        u.assert(() => lastRule.left === proof[0]);
        u.assert(() => lastRule.right === u.arrayLast(proof));
    });
    return file;
}

function removeGoal(file, left, right) {
    let log = false;
    u.scope(removeGoal.name, context => {
        u.merge(context, {file});
        u.merge(context, {left});
        u.merge(context, {right});

        assertIsProofStep(left);
        assertIsProofStep(right);

        let lines = getLines(file);

        let result = [];

        let goalCount = 0;

        u.loop(lines, line => {
            // Skip if the line is the goal.
            if (line === `${getGoalToken()} ${left} ${right}`) {
                goalCount++;
                return;
            }

            // Otherwise include the line.
            result.push(line);
        });

        u.assertIsEqual(() => goalCount, 1);

        file = result.join(u.EOL);

        u.merge(context, {result});
    });
    if (log) console.log(removeGoal.name + ' leaving', { file });
    return file;
}

function breakUpProof(proof) {
    let log = false;
    let result = [];
    u.scope(breakUpProof.name, context => {
        u.merge(context, {proof});
        // over 9 is untested
        u.assert(() => proof.length <= 9);

        let space = 1;
    
        while (space <= proof.length) {
            let i = 0;
            while (true) {
                let a = proof[i];
                if (u.isUndefined(a)) {
                    a = u.arrayLast(proof);
                }
                let b = proof[i + space];
                if (u.isUndefined(b)) {
                    b = u.arrayLast(proof);
                }
                let c = proof[i + 2*space];
                if (u.isUndefined(c)) {
                    c = u.arrayLast(proof);
                }

                let r = [a,b,c];
                if (log) console.log({r});

                if (a === b && b === c && c === a) {
                    break;
                }

                i+= space*2;

                if (a === b || b === c || a === c) {
                    continue;
                }

                result.push(r);
            }
    
            space *= 2;
        }   
    });

    return result;
}

function max3ProofSteps(file) {
    let result = [];
    u.scope(max3ProofSteps.name, x => {
        u.merge(x,{file});
        // Make sure proofs are valid.
        parseGrammar(file);

        let lines = getLines(file);

        let proof = [];
        u.loop(lines, line => {
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            } else {
                result.push(line);
            }

            processProof();
        });
        processProof();

        function processProof() {
            if (proof.length === 0) {
                return;
            }
            let proofs = breakUpProof(proof);
            u.loop(proofs, p => {
                result.push('');
                u.loop(p, step=> {
                    result.push(step);
                });
            });
            // Clear the proof buffer now that we're processed a proof
            proof = [];
        }

        file = result.join(u.EOL);
    });
    return file;
}

function formatFile(file) {
    u.scope(formatFile.name, x => {
        u.merge(x,{file});
        let lines = getLines(file);
    
        if (lines.length === 0) {
            return;
        }
        
        let result = [
            lines[0],
        ];
    
        u.loop(u.range(lines.length - 1, 1), index => {
            let previous = lines[index - 1];
            let current = lines[index];
    
            if (current === '' && current === previous) {
                return;
            }
    
            result.push(current);
        })
    
        file = result.join(u.EOL);
    })
    return file;
}

function removeRedundantProofs(file) {
    let log = false;
    let result = [];
    u.scope(removeRedundantProofs.name, context => {
        u.merge(context, {file});

        u.merge(context, {step:'reading file'});
        let lines = getLines(file);

        let proof = [];
        let rules = [];
        u.merge(context, {step:'processing lines'});
        u.loop(lines, line => {
            let rule;
            if (rule = lineIsRule(line)) {
                rules.push(rule);
            }
            if (lineIsProofStep(line)) {
                proof.push(line);
                return;
            }

            processProof();

            result.push(line);
        });
        processProof();

        file = result.join(u.EOL);

        function processProof() {
            u.scope(processProof.name, context => {
                if (proof.length === 0) {
                    return;
                }
                
                /** Omit the proof if it's provable in two-steps */
                let shorter = [proof[0], u.arrayLast(proof)];
                let valid = isValidProof(rules, shorter);
                if (log) console.log({shorter,valid});
                if (valid) {
                    // Clear proof buffer
                    proof = [];
                    return;
                }

                rules.push({left: proof[0], right: u.arrayLast(proof)});

                u.loop(proof, p=>{
                    result.push(p);
                });

                // Clear proof buffer
                proof = [];
            });
        }     
    });

    return file;
}

function trimProofs(file) {
    let log = false;
    if (log) console.log('trimProofs entered');

    let anyChanged = false;
    u.scope(trimProofs.name, context => {
        u.merge(context, {file});

        let lines = getLines(file);
        let newLines = [];

        let proof = [];
        let rules = [];
        let foundRule = false;
        u.merge(context, {lines0:lines[0]});
        u.loop(lines, line => {
            let rule;
            if (rule = lineIsRule(line)) {
                foundRule = true;
                rules.push(rule);
            }
            if (lineIsProofStep(line)) {
                u.assert(() => foundRule);
                proof.push(line);
                return;
            }

            processProof();

            newLines.push(line);
        });
        processProof();

        if (log) console.log({newLines});

        file = newLines.join(u.EOL);

        function processProof() {
            u.scope(processProof.name, context => {
                if (log) console.log(trimProofs.name + ' ' + processProof.name);
                if (log) console.log({proof});
                u.merge(context, {proof});
                if (proof.length === 0) {
                    return;
                }
                if (log) console.log('trimProofs processProof entered', { proof });

                u.assert(() => rules.length >= 1);

                // When we shorten the proof, the original
                // proof still needs to be derivable.
                let target = [proof[0], u.arrayLast(proof)];

                let trimRight = (step, i) => step.substring(0, step.length - i);
                let trimLeft = (step, i) => step.substring(i);
                let lastAllSame = (i) =>  {
                    return u.arrayAll(proof, step => {
                        let left = u.stringSuffix(step, i);
                        let right = u.stringSuffix(proof[0], i);
                        if (log) console.log({left,right,i});
                        return left === right;
                    }); 
                };
                let firstAllSame = (i) => u.arrayAll(proof, step => step.substring(0, i) === proof[0].substring(0, i));

                u.loop([{ predicate: firstAllSame, trim: trimLeft },
                    { predicate: lastAllSame, trim: trimRight },], t => {
                    let i = 0;
                    if (log) console.log({ predicate: t.predicate.name })

                    // Keep trimming
                    let changed = true;
                    while (changed) {
                        changed = false;
                        i++;

                        // We would be trimming more characters than what exist for 
                        // some proof step.
                        if (u.arraySome(proof, step => step.length <= i)) {
                            break;
                        }

                        if (t.predicate(i)) {
                            let trimmed = proof.map(step => t.trim(step, i));
                            if (log) console.log('trimProofs processProof trimmed', { trimmed });

                            if (isValidProof(rules, trimmed)) {
                                rules.push({left: trimmed[0], right: u.arrayLast(trimmed)});
            
                                if (!isValidProof(rules, target)) {
                                    rules.pop();
                                } else {
                                    // Proof can be trimmed
                                    changed = true;
                                    anyChanged = true;
                                    u.merge(context, {trimmed});
                                    if (log) console.log({proof, trimmed});
                                    u.loop(trimmed, p=>{
                                        newLines.push(p);
                                    });
                                    newLines.push('');
                                }
                            }
                        } else {
                            if (log) console.log('trimProofs processProof predicate failed');
                        }
                    }
                });
                
                // Maybe this will fail if proofs cannot
                // be trimmed like this
                u.merge(context, {rules});
                u.merge(context, {proof});
                u.assert(() => isValidProof(rules, proof));

                rules.push({left: proof[0], right: u.arrayLast(proof)});

                u.loop(proof, p=>{
                    newLines.push(p);
                });

                // Clear proof buffer
                proof = [];
            });
        }
    });

    return { anyChanged, newContents: file };
}
},{"./library/assertIsProofStep":1,"./library/getGoalToken":2,"./library/getLines":3,"./library/isValidProof":4,"./library/lineIsProofStep":7,"./library/parseGrammar":8,"fs":75,"wlj-utilities":18}],"/library/prover":[function(require,module,exports){

const u = require("wlj-utilities");
const proverStep = require("./proverStep");


module.exports = prover;

function prover(contents, maxDepth) {
    let log = false;
    u.scope(prover.name, x => {

        if (u.isUndefined(maxDepth)) {
            maxDepth = 8;
        }
        u.assert(() => u.isInteger(maxDepth));

        let provedGoal = true;
        while (provedGoal) {
            u.merge(x, {step: 'starting loop'});

            let { newProvedGoal, newContents } = proverStep(contents, maxDepth);
            if (log) console.log(loadAndProver.name, { newContents, newProvedGoal })
            contents = newContents;
            contents = newContents;
            provedGoal = newProvedGoal;
        }
    });
    return contents;
}

},{"./proverStep":9,"wlj-utilities":18}],75:[function(require,module,exports){

},{}],76:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],77:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":78}],78:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[]);
