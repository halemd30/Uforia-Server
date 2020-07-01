const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();

authRouter.post("/login", (req, res, next) => {
  const { password, username } = req.body;
  /*
    const password = req.body.password
    const username = req.body.username
  */
  const loginUser = { username, password };
  /*
    {'username': username, 'password': password}
  */

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUser(req.app.get("db"), loginUser.username)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect username or password",
        });

      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect username or password",
          });

        const sub = dbUser.username;
        const payload = { user_id: dbUser.id };
        res.json({
          authToken: AuthService.createJwt(sub, payload),
          //user_id: payload.user_id,
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
