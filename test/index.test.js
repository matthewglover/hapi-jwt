import test from 'ava';
import Hapi from 'hapi';
import { omit } from 'ramda';
import { createServer, setConnection, registerPlugins } from '@matthewglover/hapi-wrapper';
import HapiJwt from '../';

// server :: [Hapi.Plugin] -> Promise Hapi.Server Error
const server = plugins =>
  createServer()
  .then(setConnection())
  .then(registerPlugins(plugins));

const options = {
  jwtSecret: 'my-jwt-secret',
  issueTokenPath: '/issue-token',
};

// eslint-disable-next-line max-len
test('plugin loads without error provided opts.jwtSecret and opts.issueTokenPath are specified', async (t) => {
  t.true(await server([{ register: HapiJwt, options }]) instanceof Hapi.Server);
});

// eslint-disable-next-line max-len
test('plugin throws error if opts.jwtSecret not specified', async (t) => {
  t.throws(server([{ register: HapiJwt, options: omit(['jwtSecret'], options) }]));
});

// eslint-disable-next-line max-len
test('plugin throws error if opts.issueTokenPath not specified', async (t) => {
  t.throws(server([{ register: HapiJwt, options: omit(['issueTokenPath'], options) }]));
});
