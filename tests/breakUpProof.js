const {
    logIndent,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
} = require('../../utilities/all');

const {
    breakUpProof,
} = require('../grammars');

logIndent(__filename, context => {
    let proof;
    
    assertIsEqualJson(() => breakUpProof([`1`,`2`,`3`]), [["1","2","3"]]);
});