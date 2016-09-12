const { replace } = require('ramda');
const pProp = require('../../util/p_prop');

// NOTE: extractAuthHeaderFromRequest part of async promise chain
// so uses a Promise to take advantage of error handling control flow

// extractAuthHeaderFromRequest :: Hapi.Request -> Promise String Error
const extractAuthHeaderFromRequest = req =>
  pProp('headers', req)
  .then(pProp('authorization'));

// extractTokenFromAuthHeader :: String -> String
const extractTokenFromAuthHeader = replace(/Bearer\s+/gi, '');

module.exports = {
  extractAuthHeaderFromRequest,
  extractTokenFromAuthHeader,
};
