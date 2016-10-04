import test from 'ava';
import querystring from 'querystring';
import { omit } from 'ramda';
import { createServer, setConnection, addRoutes } from '@matthewglover/hapi-wrapper';
import provisionInjectPromise from '../../test_helpers/provision_inject_promise';
import signJWT from '../../util/sign_jwt';
import createTokenRoute from '../../lib/create_token_route';


const testServer = routes =>
  createServer()
  .then(setConnection())
  .then(addRoutes(routes))
  .then(provisionInjectPromise);

const dummyData = {
  id: '1234',
  name: 'matt',
  iat: '3432432',
};

const tokenOptions = {
  createTokenPath: '/create-token',
  prepareTokenData: req => req.query,
  issueTokenPath: '/issue-token',
  jwtOptions: { algorithm: 'HS256' },
  jwtSecret: 'jwt-secret',
};

// eslint-disable-next-line max-len
test('createTokenRoute creates a jwt and redirects to issueTokenPath', async (t) => {
  const expectedToken =
    await signJWT(tokenOptions.jwtOptions, 'jwt-secret', dummyData);

  const tokenRoute = createTokenRoute(tokenOptions);
  const server = await testServer([tokenRoute]);
  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/create-token?${querystring.stringify(dummyData)}`,
    });

  t.is(reply.headers.location, `/issue-token?jwt=${expectedToken}`);
});

// eslint-disable-next-line max-len
test('createTokenRoute - jwtOptions can be undefined (defaults to { algorithm: "HS256" })', async (t) => {
  const expectedToken =
    await signJWT(tokenOptions.jwtOptions, 'jwt-secret', dummyData);

  const tokenRoute = createTokenRoute(omit('jwtOptions', tokenOptions));
  const server = await testServer([tokenRoute]);
  const reply =
    await server.injectPromise({
      method: 'GET',
      url: `/create-token?${querystring.stringify(dummyData)}`,
    });

  t.is(reply.headers.location, `/issue-token?jwt=${expectedToken}`);
});
