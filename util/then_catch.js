const { curry } = require('ramda');

// thenCatch :: (a -> b) -> (Error -> void) -> Promise a Error -> Promise b void
const thenCatch = curry((onResolve, onReject, promise) =>
  promise.then(onResolve, onReject));

module.exports = thenCatch;
