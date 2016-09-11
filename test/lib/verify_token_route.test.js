import test from 'ava';
import { omit } from 'ramda';
import { createServer, setConnection, addRoutes } from '@matthewglover/hapi-wrapper';
import provisionInjectPromise from '../../test_helpers/provision_inject_promise';
import signJWT from '../../util/sign_jwt';
import verifyTokenRoute from '../../lib/verify_token_route';


const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

const testServer = routes =>
  createServer()
  .then(setConnection())
  .then(addRoutes(routes))
  .then(provisionInjectPromise);

const payload = {
  id: '1234',
  name: 'matt',
};

const tokenOptions = {
  verifyTokenPath: '/verify-token',
  jwtVerificationOptions: { algorithm: 'HS256' },
  jwtSecret: 'jwt-secret',
};

test('verifyTokenRoute returns jwt payload if jwt is a valid token', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'jwt-secret', payload);

  const tokenRoute = verifyTokenRoute(tokenOptions);
  const server = await testServer([tokenRoute]);
  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/verify-token?jwt=${validToken}`,
    });
  t.deepEqual(omit('iat', reply.result), payload);
});

test('verifyTokenRoute returns Boom error if jwt is an invalidly signed token', async t => {
  const invalidToken =
    await signJWT({ algorithm: 'HS256' }, 'incorrect-secret', payload);

  const tokenRoute = verifyTokenRoute(tokenOptions);
  const server = await testServer([tokenRoute]);
  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/verify-token?jwt=${invalidToken}`,
    });

  t.deepEqual(reply.result,
    { statusCode: 400, error: 'Bad Request', message: 'invalid signature' });
});

test('verifyTokenRoute returns Boom error if jwt is an expired token', async t => {
  const invalidToken =
    await signJWT({ algorithm: 'HS256', expiresIn: '1ms' }, 'jwt-secret', payload);

  const tokenRoute = verifyTokenRoute(tokenOptions);
  const server = await testServer([tokenRoute]);

  await delay(2);

  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/verify-token?jwt=${invalidToken}`,
    });

  t.deepEqual(reply.result,
    { statusCode: 400, error: 'Bad Request', message: 'jwt expired' });
});

// eslint-disable-next-line max-len
test('verifyTokenRoute - jwtVerificationOptions can be undefined (defaults to { algorithm: "HS256" })', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'jwt-secret', payload);

  const tokenRoute = verifyTokenRoute(omit('jwtVerificationOptions', tokenOptions));
  const server = await testServer([tokenRoute]);
  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/verify-token?jwt=${validToken}`,
    });
  t.deepEqual(omit('iat', reply.result), payload);
});
