const {
    logIndent,
    assert,
    isDefined,
    isArray,
    merge,
    isEqualJson,
    assertIsEqualJson,
    throws,
    range,
} = require('../../utilities/all');

const {
    breakUpProof,
} = require('../grammars');

logIndent(__filename, context => {
    let proof;
    
    assertIsEqualJson(() => breakUpProof([`1`,`2`,`3`]), [["1","2","3"]]);
    assertIsEqualJson(() => breakUpProof(range(4,1).map(s => s+'')), [["1","2","3"],["1","3","4"]]);
    assertIsEqualJson(() => breakUpProof([`1`,`2`,`3`,'4','5']), [["1","2","3"],["3","4","5"],["1","3","5"]]);
    assertIsEqualJson(() => breakUpProof(range(6,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["1","3","5"],["1","5","6"]]);
    assertIsEqualJson(() => breakUpProof(range(7,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["1","3","5"],["1","5","7"]]);
    assertIsEqualJson(() => breakUpProof(range(8,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["1","3","5"],["5","7","8"],["1","5","8"]]);
    assertIsEqualJson(() => breakUpProof(range(9,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["7","8","9"],["1","3","5"],["5","7","9"],["1","5","9"]]);
});