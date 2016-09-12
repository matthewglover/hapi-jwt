import test from 'ava';
import sinon from 'sinon';
import thenCatch from '../../util/then_catch';

const errorStub = sinon.spy();

const f = thenCatch(x => x * 2, errorStub);

test('thenCall calls success handler when called with resolving promise', async t => {
  t.is(await f(Promise.resolve(10)), 20);
});

test('thenCall calls onReject handler when called with rejecting promise', async t => {
  await f(Promise.reject(new Error('boom')));
  t.true(errorStub.calledOnce);
});
