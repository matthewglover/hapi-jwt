import test from 'ava';
import wrapBoom from '../../util/wrap_boom';

test('wrapBoom creates a boom error message from an error', (t) => {
  const boomError = wrapBoom({ statusCode: 400 }, new Error('Generic error'));
  t.plan(4);
  t.true(boomError instanceof Error);
  t.is(boomError.message, 'Generic error');
  t.true(boomError.isBoom);
  t.is(boomError.output.statusCode, 400);
});

// eslint-disable-next-line max-len
test('wrapBoom options.statusCode and options.message are optional (statusCode default to 400)', (t) => {
  const boomError = wrapBoom({}, new Error('Generic error'));
  t.plan(4);
  t.true(boomError instanceof Error);
  t.is(boomError.message, 'Generic error');
  t.true(boomError.isBoom);
  t.is(boomError.output.statusCode, 400);
});
