require('env2')('./config.env');
const hapiOauth = require('@matthewglover/hapi-oauth');

const options = {
  configs: [
    {
      provider: 'facebook',
      loginPath: '/fb-login',
      authPath: '/fb-auth',
      redirectPath: '/create-token',
      baseUrl: process.env.BASE_URL,
      clientId: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      options: {
        scope: 'user_likes',
      },
    },
  ],
};

module.exports = { register: hapiOauth, options };
