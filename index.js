const KindeAuth = require('@kinde-oss/kinde-auth-react');

module.exports = function kindeAuthPlugin(options) {
  const seneca = this;

  // Initialize Kinde Auth with options
  const kindeAuth = new KindeAuth({
    domain: options.domain,
    clientId: options.clientId,
    redirectUri: options.redirectUri,
    audience: options.audience,
  });

  const intern = {
    // Define internal functions to handle each message
    async register_user(msg, reply) {
      try {
        // Implement registration logic
        const result = await kindeAuth.register(msg.userDetails);
        reply(null, { success: true, result });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    async get_kinde_user(msg, reply) {
      try {
        const user = await kindeAuth.getUserInfo(msg.token);
        reply(null, { success: true, user });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    async list_user(msg, reply) {
      try {
        // Implement logic to list users
        const users = await kindeAuth.listUsers();
        reply(null, { success: true, users });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    // Additional internal functions go here...

    async login_user(msg, reply) {
      try {
        const token = await kindeAuth.login(msg.credentials);
        reply(null, { success: true, token });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    async logout_user(msg, reply) {
      try {
        await kindeAuth.logout(msg.token);
        reply(null, { success: true });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    async auth_user(msg, reply) {
      try {
        const userInfo = await kindeAuth.getUserInfo(msg.token);
        reply(null, { success: true, user: userInfo });
      } catch (error) {
        reply(null, { success: false, message: error.message });
      }
    },

    // Implement other functions similarly...

    make_msg(action, ctx) {
      return async function (msg, reply) {
        return intern[action](msg, reply);
      };
    },
  };

  const ctx = {}; // Context for the messages

  // Define the message patterns
  seneca
    .message('register:user', intern.make_msg('register_user', ctx))
    .message('get:kinde_user', intern.make_msg('get_kinde_user', ctx))
    .message('list:kinde_user', intern.make_msg('list_user', ctx))
    .message('adjust:kinde_user', intern.make_msg('adjust_user', ctx))
    .message('update:user', intern.make_msg('update_user', ctx))
    .message('remove:user', intern.make_msg('remove_user', ctx))
    .message('login:kinde_user', intern.make_msg('login_user', ctx))
    .message('logout:user', intern.make_msg('logout_user', ctx))
    .message('list:login', intern.make_msg('list_login', ctx))
    .message('make:verify', intern.make_msg('make_verify', ctx))
    .message('list:verify', intern.make_msg('list_verify', ctx))
    .message('change:pass', intern.make_msg('change_pass', ctx))
    .message('change:handle', intern.make_msg('change_handle', ctx))
    .message('change:email', intern.make_msg('change_email', ctx))
    .message('check:handle', intern.make_msg('check_handle', ctx))
    .message('check:verify', intern.make_msg('check_verify', ctx))
    .message('check:exists', intern.make_msg('check_exists', ctx))
    .message('auth:kinde_user', intern.make_msg('auth_user', ctx));

  return {
    name: 'kindeAuthPlugin',
  };
};
