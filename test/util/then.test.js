import test from 'ava';
import then from '../../util/then';

const f = then(x => x * 2);

test('then calls success handler when called with resolving promise', async t => {
  t.is(await f(Promise.resolve(10)), 20);
});

test('then returns rejected promise when called with rejecting promise', t => {
  t.throws(f(Promise.reject(new Error('boom'))));
});
