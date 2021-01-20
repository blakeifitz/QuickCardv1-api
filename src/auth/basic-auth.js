const AuthService = require('./auth-service');
const bcrypt = require('bcryptjs');

function requireAuth(req, res, next) {
  const authToken = req.get('authorization') || '';
  let basicToken;
  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' });
  } else {
    basicToken = authToken.slice('basic'.length, authToken.length);
  }

  const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(
    basicToken
  );

  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request 1' });
  }
  AuthService.getUserWithUserName(req.app.get('db'), tokenUserName)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request 2' });
      }
      return AuthService.comparePasswords(tokenPassword, user.password).then(
        (passwordsMatch) => {
          if (!passwordsMatch) {
            return res.status(401).json({ error: 'Unauthorized request 3' });
          }
          req.user = user;
          next();
        }
      );
    })
    .catch(next);
}

module.exports = {
  requireAuth,
};
