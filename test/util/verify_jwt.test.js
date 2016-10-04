import test from 'ava';
import { omit } from 'ramda';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import signJWT from '../../util/sign_jwt';
import verifyJWT from '../../util/verify_jwt';

const delay = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const payload = { name: 'matt' };

// eslint-disable-next-line max-len
test('verifyJWT returns a Promise resolving to decoded payload if token validly issued', async (t) => {
  const secret = 'my-secret';
  const token = await signJWT({ algorithm: 'HS256' }, secret, payload);
  const decoded = await verifyJWT(null, secret, token);

  t.deepEqual(omit('iat', decoded), payload);
});

// eslint-disable-next-line max-len
test('verifyJWT returns a Promise rejecting with an error if token not validly issued', async (t) => {
  const token = await signJWT({ algorithm: 'HS256' }, 'invalid-secret', payload);

  t.plan(2);
  const err = await t.throws(verifyJWT(null, 'my-secret', token));
  t.true(err instanceof JsonWebTokenError);
});

// eslint-disable-next-line max-len
test('verifyJWT returns a Promise rejecting with an error if token expired', async (t) => {
  const token = await signJWT({ algorithm: 'HS256', expiresIn: '1ms' }, 'my-secret', payload);
  await delay(2);

  t.plan(2);
  const err = await t.throws(verifyJWT(null, 'my-secret', token));
  t.true(err instanceof TokenExpiredError);
});
