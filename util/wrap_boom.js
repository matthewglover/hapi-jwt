const Boom = require('boom');
const { curry } = require('ramda');

const wrapBoom = curry(({ statusCode, message }, err) =>
  Boom.wrap(err, statusCode || 400, message));

module.exports = wrapBoom;
