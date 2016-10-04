const { curry } = require('ramda');

// pProp :: String -> Object -> Promise any Error
const pProp = curry((p, o) =>
  new Promise((resolve, reject) =>
    (o[p] !== undefined
      ? resolve(o[p])
      : reject(new TypeError(`Property ${p} not found on object`)))));

module.exports = pProp;
