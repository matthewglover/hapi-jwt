const createTokenRoute = require('./create_token_route');
const verifyTokenRoute = require('./verify_token_route');
const jwtScheme = require('./jwt_scheme');

//  register :: (Hapi.Server, Options, Function) -> void
const register = (server, opts, next) => {
  server.route([createTokenRoute(opts), verifyTokenRoute(opts)]);
  server.auth.scheme('jwtScheme', jwtScheme);
  server.auth.strategy(opts.strategyName || 'jwt', 'jwtScheme', opts);
  next();
};

module.exports = register;
