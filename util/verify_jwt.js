const jwt = require('jsonwebtoken');
const { curry } = require('ramda');
const promisify = require('./promisify');

// verify :: (String, String, Object?) -> Promise Object Error
const verify = promisify(jwt.verify, jwt);

// verifyJWT :: Object? -> String -> String -> Promise Object Error
const verifyJWT = curry((options, secret, payload) =>
  verify(payload, secret, options));

module.exports = verifyJWT;
