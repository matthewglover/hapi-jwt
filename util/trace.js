const { curry } = require('ramda');

const trace = curry((desc, value) => {
  if (process.env.NODE_ENV === 'test') console.log(desc, value); // eslint-disable-line no-console
  return value;
});

module.exports = trace;
