const { compose, bind } = require('ramda');
const verifyJwt = require('../../util/verify_jwt');
const wrapBoom = require('../../util/wrap_boom');
const { extractTokenFromAuthHeader, extractAuthHeaderFromRequest } = require('./helpers');


// jwtScheme :: (Hapi.Server, Options) => Object
const jwtScheme = (server, { verificationOptions, jwtSecret, validateCredentials }) =>
  ({
    authenticate: (req, reply) =>
      extractAuthHeaderFromRequest(req)
      .then(extractTokenFromAuthHeader)
      .then(verifyJwt(verificationOptions, jwtSecret))
      .then(validateCredentials)
      .then(credentials => ({ credentials }))
      .then(bind(reply.continue, reply))
      .catch(compose(reply, wrapBoom({ statusCode: 400 }))),
  });

module.exports = jwtScheme;
