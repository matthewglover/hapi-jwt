const { createServer, setConnection, registerPlugins, addRoutes, startServer } =
  require('@matthewglover/hapi-wrapper');
const oauthPlugin = require('./oauth_plugin');
const jwtPlugin = require('./jwt_plugin');

const protectedRoute = {
  method: 'GET',
  path: '/protected',
  config: { auth: 'jwt' },
  handler: (req, reply) => reply('boom'),
};

const server =
  createServer()
  .then(setConnection({ port: 3000 }))
  .then(registerPlugins([oauthPlugin, jwtPlugin]))
  .then(addRoutes([protectedRoute]))
  .then(startServer)
  /* eslint-disable no-console */
  .then(s => console.log(`Server running at: ${s.info.uri}`))
  .catch(err => console.error(err));
  /* eslint-enable */

module.exports = server;
