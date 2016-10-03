require('env2')('./config.env');
const hapiJwt = require('../');

/* eslint-disable max-len */
const options = {
  strategyName: 'jwt',                            // Name of strategy (defaults to jwt)

  createTokenPath: '/create-token',               // Path for token creation
  prepareTokenData: req => req.query,             // Function to prepare token payload data

  issueTokenPath: '/issue-token.html',            // Path which will issue token (as /issue-token.html?jwt=[token])

  verifyTokenPath: '/verify-token',               // Path which will verify token (as /verify-token?jwt=[token])

  jwtOptions: { algorithm: 'HS256' },             // jwt creation options (as per jsonwebtoken.sign)
  jwtVerificationOptions: { algorithm: 'HS256' }, // jwt verification options (as per jsonwebtoken.verify)
  jwtSecret: process.env.JWT_SECRET,              // secret for creating token
};
/* eslint-enable max-len */

module.exports = { register: hapiJwt, options };
