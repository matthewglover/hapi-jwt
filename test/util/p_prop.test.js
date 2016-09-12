import test from 'ava';
import pProp from '../../util/p_prop';

const obj = {
  a: 1,
  b: 2,
};

test('pProp returns a promise resolving to object`s value for given key', async t => {
  t.is(await pProp('a', obj), 1);
});


test('pProp returns a promise rejecting with an error when given key is undefined', t => {
  t.throws(pProp('c', obj));
});
