const register = require('./lib/register');
const pkg = require('./package.json');

register.attributes = { pkg };

module.exports = { register };
