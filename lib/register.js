const { merge, prop, identity } = require('ramda');
const createTokenRoute = require('./create_token_route');
const verifyTokenRoute = require('./verify_token_route');
const jwtScheme = require('./jwt_scheme');


const OPTION_DEFAULTS = {
  jwtOptions: { algorithm: 'HS256' },
  createTokenPath: '/create-token',
  verifyTokenPath: '/verify-token',
  strategyName: 'jwt',
  jwtVerificationOptions: { algorithm: 'HS256' },
  prepareTokenData: prop('query'),
  validateCredentials: identity,
};

const applyDefaults = merge(OPTION_DEFAULTS);

//  register :: (Hapi.Server, Options, Function) -> void
const register = (server, opts, next) => {
  if (!opts.jwtSecret) return next(new Error('Options must specify a jwtSecret'));
  if (!opts.issueTokenPath) return next(new Error('Options must specify an issueTokenPath'));

  const completeOpts = applyDefaults(opts);

  server.route([createTokenRoute(completeOpts), verifyTokenRoute(completeOpts)]);
  server.auth.scheme('jwtScheme', jwtScheme);
  server.auth.strategy(completeOpts.strategyName, 'jwtScheme', completeOpts);
  return next();
};

module.exports = register;
