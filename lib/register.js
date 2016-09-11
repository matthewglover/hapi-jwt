const createTokenRoute = require('./create_token_route');

//  register :: (Hapi.Server, Options, Function) -> void
const register = (server, options, next) => {
  server.route([createTokenRoute(options)]);
  next();
};

module.exports = register;
