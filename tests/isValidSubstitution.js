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
    isValidSubstitution,
} = require('../grammars');

logIndent(__filename, context => {
    let i = 0;
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abc', 'adc', 'b', 'd', 1), {"valid":true});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abc', 'ade', 'b', 'd', 1), {"valid":false,"message":"after does not match"});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abc', 'aec', 'b', 'd', 1), {"valid":false,"message":"right does not match current"});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('ebc', 'adc', 'b', 'd', 1), {"valid":false,"message":"before does not match"});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('aec', 'adc', 'b', 'd', 1), {"valid":false,"message":"left does not match previous"});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abbc', 'adbc', 'b', 'd', 1), {"valid":true});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abbc', 'addc', 'bb', 'dd', 1), {"valid":true});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abbc', 'addd', 'bbc', 'ddd', 1), {"valid":true});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('ac', 'addd', 'c', 'ddd', 1), {"valid":true});
    merge(context, {i:i++});
    assertIsEqualJson(isValidSubstitution('abbc', 'ad', 'bbc', 'd', 1), {"valid":true});
});