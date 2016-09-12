const { curry } = require('ramda');

// then :: (a -> b) -> Promise a Error -> Promise b Error
const then = curry((onResolve, promise) =>
  promise.then(onResolve));

module.exports = then;
