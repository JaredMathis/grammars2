const u = require('wlj-utilities');
const isValidSubstitution = require('../library/isValidSubstitution');

u.scope(__filename, x => {
    let i = 0;
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abc', 'adc', 'b', 'd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abc', 'ade', 'b', 'd', 1), {"valid":false,"message":"after does not match"});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abc', 'aec', 'b', 'd', 1), {"valid":false,"message":"right does not match current"});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('ebc', 'adc', 'b', 'd', 1), {"valid":false,"message":"before does not match"});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('aec', 'adc', 'b', 'd', 1), {"valid":false,"message":"left does not match previous"});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abbc', 'adbc', 'b', 'd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abbc', 'addc', 'bb', 'dd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abbc', 'addd', 'bbc', 'ddd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('ac', 'addd', 'c', 'ddd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('abbc', 'ad', 'bbc', 'd', 1), {"valid":true});
    u.merge(x, {i:i++});
    u.assertIsEqualJson(isValidSubstitution('a11', '1a1', 'a1', '1a', 0), {"valid":true});
});