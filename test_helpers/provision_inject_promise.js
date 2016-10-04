/* eslint-disable no-param-reassign */

// provisionInjectPromise :: Hapi.Server -> Hapi.Server
const provisionInjectPromise = (server) => {
  server.injectPromise = options =>
    new Promise(resolve => server.inject(options, resolve));

  return server;
};

module.exports = provisionInjectPromise;
