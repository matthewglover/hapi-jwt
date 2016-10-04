import test from 'ava';
import {
  extractTokenFromAuthHeader,
  extractAuthHeaderFromRequest } from '../../../lib/jwt_scheme/helpers';

test('extractAuthHeaderFromRequest gets value of req.headers.authorization', async t => {
  const req = { headers: { authorization: 'Bearer my-token' } };
  t.is(await extractAuthHeaderFromRequest(req), 'Bearer my-token');
});

test('extractAuthHeaderFromRequest throws error if req.headers.authorization not set', async t => {
  const req = { headers: {} };
  t.throws(extractAuthHeaderFromRequest(req));
});

test('extractTokenFromAuthHeader gets token from auth header with Bearer prefix', t => {
  t.is(extractTokenFromAuthHeader('Bearer my-token'), 'my-token');
});

test('extractTokenFromAuthHeader gets token from auth header without Bearer prefix', t => {
  t.is(extractTokenFromAuthHeader('my-token'), 'my-token');
});
