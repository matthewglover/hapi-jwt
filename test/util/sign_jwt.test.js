import test from 'ava';
import signJWT from '../../util/sign_jwt';

test('signJWT creates a JSON Web Token from a secret, options object and payload', async (t) => {
  const actual =
    await signJWT({ algorithm: 'HS256' }, 'my-secret', { name: 'matt', iat: 12345 });
  const expected =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWF0dCIsImlhdCI6MTIzNDV9.W2-1tQTVu_q5aBZUVJKoYUIwkJJVrniPvOOEIA2o3rQ'; // eslint-disable-line max-len

  t.is(actual, expected);
});
