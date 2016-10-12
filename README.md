[![Build Status](https://travis-ci.org/matthewglover/hapi-jwt.svg?branch=master)](https://travis-ci.org/matthewglover/hapi-jwt) [![Coverage Status](https://coveralls.io/repos/github/matthewglover/hapi-jwt/badge.svg?branch=master)](https://coveralls.io/github/matthewglover/hapi-jwt?branch=master)

# hapi-jwt

## What
A hapi authentication plugin using Json Web Tokens.

## Why
To create a simple way to add web token authentication to routes, and to learn more about JWTs, Hapi plugins, auth schemes and strategies.

## How
To install, run `npm install --save @matthewglover/hapi-jwt`.

A simple implementation:

```javascript
const { createServer, setConnection, registerPlugins, addRoutes, startServer } =
  require('@matthewglover/hapi-wrapper');
const hapiJwt = require('@matthewglover/hapi-jwt');

const options = {
  strategyName: 'jwt',                            // Name of strategy (defaults to jwt)
  authMode: false,                                // Strategy auth mode (options as per mode in server.auth.strategy)
  createTokenPath: '/create-token',               // Path for token creation
  prepareTokenData: req => req.query,             // Function to prepare token payload data
  issueTokenPath: '/issue-token',                 // Path which will issue token (as /issue-token.html?jwt=[token])
  verifyTokenPath: '/verify-token',               // Path which will verify token (as /verify-token?jwt=[token])
  jwtOptions: { algorithm: 'HS256' },             // jwt creation options (as per jsonwebtoken.sign)
  jwtSecret: 'your-secret',                       // secret for creating token
  validateCredentials: v => v,                    // Function to validateCredentials decoded from payload
};

const issueTokenRoute = {
  method: 'GET',
  path: '/issue-token',
  handler: (req, reply) => reply(req.query),
}

createServer()
.then(setConnection({ port: 3000 }))
.then(registerPlugins([{ register: hapiJwt, options }]))
.then(addRoutes([issueTokenRoute]))
.then(startServer)
.then(s => console.log(`Server running at: ${s.info.uri}`))
.catch(err => console.error(err));

```

The only required option properties are:

- `jwtSecret` - your private secret used to encrypt the token
- `issueTokenPath` - the path to receive the json web token (passed as jwt=[token])

The following params are optional:

- `strategyName` - (default `jwt`) the name associated with your strategy
- `authMode` - (default `false`) the authentication mode (possible values are the same as server.auth.strategy mode options - `true`, `false`, `'required'`, `'optional'`, `'try'`)
- `createTokenPath` - (default `/create-token`) the path which will create the token
- `prepareTokenData` - (default `req => req.query`) a function to prepare any data before being encoded (recieves the Hapi request object)
- `verifyTokenPath` - (default `/verify-token`) a path which will verify the token (expects token to be passed as jwt=[token])
- `jwtOptions` - (default `{ algorithm: 'HS256' }`) the jwt options (as per jsonwebtoken.sign)
- `validateCredentials` - (default `v => v`) a function to validate decoded payload of valid jwt
