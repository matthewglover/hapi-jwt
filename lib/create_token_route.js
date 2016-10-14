const signJWT = require('../util/sign_jwt');

// type Options = {
//  createTokenPath: String,
//  prepareTokenData: Function,
//  issueTokenPath: String
//  jwtOptions: Object?,
//  jwtSecret: String,
// }

// const JWT_DEFAULT_OPTIONS = { algorithm: 'HS256' };

// createTokenRoute :: Options -> Hapi.Route
const createTokenRoute = opts =>
  ({
    method: 'GET',
    path: opts.createTokenPath,
    config: { auth: false },
    handler: (req, reply) =>
      Promise.resolve(opts.prepareTokenData(req))
      .then(signJWT(opts.jwtOptions, opts.jwtSecret))
      .then(token => reply.redirect(`${opts.issueTokenPath}?jwt=${token}`)),
  });

module.exports = createTokenRoute;
