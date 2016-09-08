import test from 'ava';
import promisify from '../../util/promisify';

// cbFn :: (any, Function) -> Void
const cbFn = (a, cb) =>
  process.nextTick(() =>
    (a === 10 ?
      cb(null, a) :
      cb(new Error('Arg should be 10'))));

// pFn :: any -> Promise 10 Error
const pFn = promisify(cbFn);

test('promisify returns Promise resolving to success value', async t => {
  t.is(await pFn(10), 10);
});

test('promisify returns Promise rejecting to an error value', async t => {
  const err = await t.throws(pFn(9));
  t.regex(err.message, /Arg should be 10/);
});
