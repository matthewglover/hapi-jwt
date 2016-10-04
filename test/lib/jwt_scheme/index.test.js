import test from 'ava';
import { omit, merge } from 'ramda';
import { createServer, setConnection, addRoutes } from '@matthewglover/hapi-wrapper';
import provisionInjectPromise from '../../../test_helpers/provision_inject_promise';
import signJWT from '../../../util/sign_jwt';
import jwtScheme from '../../../lib/jwt_scheme';


const testServer = (routes, opts) =>
  createServer()
  .then(provisionInjectPromise)
  .then(setConnection())
  .then(server => {
    server.auth.scheme('jwtScheme', jwtScheme);
    server.auth.strategy(opts.strategyName || 'jwt', 'jwtScheme', opts);
    return server;
  })
  .then(addRoutes(routes));

const testRoute = {
  method: 'GET',
  path: '/test',
  config: { auth: 'jwt' },
  handler: (req, reply) => reply(req.auth.credentials),
};


// NOTE:
// verificationOptions - uses jsonwebtoken's verify under the hood, and so can use same options
// validateCredentials - signature is Credentials -> Promise Credentials Error
const testOptions = {
  verificationOptions: { algorithm: 'HS256' },
  jwtSecret: 'my-secret',
  validateCredentials: credentials => Promise.resolve(credentials),
};

const failingCredentialsOptions =
  Object.assign(
    {},
    testOptions,
    { validateCredentials: () => Promise.reject(new Error('Invalid credentials')) });

const testCredentials = { name: 'matt' };

test('jwtScheme allows access if valid token provided', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'my-secret', testCredentials);

  const headers = { Authorization: `Bearer ${validToken}` };
  const server = await testServer([testRoute], testOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 200);
  t.deepEqual(omit('iat', reply.result), testCredentials);
});

test('jwtScheme blocks access if invalid token provided', async t => {
  const invalidToken =
    await signJWT({ algorithm: 'HS256' }, 'invalid-secret', testCredentials);

  const headers = { Authorization: `Bearer ${invalidToken}` };
  const server = await testServer([testRoute], testOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 400);
  t.regex(reply.result.message, /invalid signature/);
});

test('jwtScheme blocks access if no token provided', async t => {
  const headers = {};
  const server = await testServer([testRoute], testOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 400);
  t.regex(reply.result.message, /Property authorization not found on object/);
});

test('jwtScheme blocks access if credentials fail jwt validation', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'my-secret', testCredentials);

  const headers = { Authorization: `Bearer ${validToken}` };
  const server = await testServer([testRoute], failingCredentialsOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 400);
  t.regex(reply.result.message, /Invalid credentials/);
});

// eslint-disable-next-line max-len
test('jwtScheme blocks access if credentials pass jwt validation but fail custom validation via Promise rejection', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'my-secret', testCredentials);

  const invalidateCredentials = () => Promise.reject(new Error('Invalid options'));
  const invalidOptions = merge(testOptions, { validateCredentials: invalidateCredentials });

  const headers = { Authorization: `Bearer ${validToken}` };
  const server = await testServer([testRoute], invalidOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 400);
  t.regex(reply.result.message, /Invalid options/);
});

// eslint-disable-next-line max-len
test('jwtScheme blocks access if credentials pass jwt validation but fail custom validation via thrown error', async t => {
  const validToken =
    await signJWT({ algorithm: 'HS256' }, 'my-secret', testCredentials);

  const invalidateCredentials = () => { throw new Error('Invalid options'); };
  const invalidOptions = merge(testOptions, { validateCredentials: invalidateCredentials });

  const headers = { Authorization: `Bearer ${validToken}` };
  const server = await testServer([testRoute], invalidOptions);
  const reply = await server.injectPromise({ method: 'GET', url: '/test', headers });

  t.is(reply.statusCode, 400);
  t.regex(reply.result.message, /Invalid options/);
});
