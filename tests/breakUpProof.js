const u = require('wlj-utilities');

const {
    breakUpProof,
} = require('../grammars');

u.scope(__filename, context => {
    let proof;
    
    u.assertIsEqualJson(() => breakUpProof([`1`,`2`,`3`]), [["1","2","3"]]);
    u.assertIsEqualJson(() => breakUpProof(u.range(4,1).map(s => s+'')), [["1","2","3"],["1","3","4"]]);
    u.assertIsEqualJson(() => breakUpProof([`1`,`2`,`3`,'4','5']), [["1","2","3"],["3","4","5"],["1","3","5"]]);
    u.assertIsEqualJson(() => breakUpProof(u.range(6,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["1","3","5"],["1","5","6"]]);
    u.assertIsEqualJson(() => breakUpProof(u.range(7,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["1","3","5"],["1","5","7"]]);
    u.assertIsEqualJson(() => breakUpProof(u.range(8,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["1","3","5"],["5","7","8"],["1","5","8"]]);
    u.assertIsEqualJson(() => breakUpProof(u.range(9,1).map(s => s+'')), [["1","2","3"],["3","4","5"],["5","6","7"],["7","8","9"],["1","3","5"],["5","7","9"],["1","5","9"]]);
});