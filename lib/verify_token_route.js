const { compose } = require('ramda');
const verifyJWT = require('../util/verify_jwt');
const wrapBoom = require('../util/wrap_boom');

// type Options = {
//  verifyTokenPath: String,
//  jwtSecret: String,
//  jwtVerificationOptions: Object?,
// }

const JWT_VERIFICATION_OPTIONS = { algorithm: 'HS256' };

// createTokenRoute :: Options -> Hapi.Route
const createTokenRoute = opts =>
  ({
    method: 'GET',
    path: opts.verifyTokenPath,
    handler: (req, reply) =>
      verifyJWT(opts.jwtVerificationOptions || JWT_VERIFICATION_OPTIONS,
                opts.jwtSecret, req.query.jwt)
      .then(reply)
      .catch(compose(reply, wrapBoom({ statusCode: 400 }))),
  });

module.exports = createTokenRoute;
