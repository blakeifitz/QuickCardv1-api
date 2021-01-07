const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const jsonBodyParser = express.json();


authRouter.post("/login", jsonBodyParser,(req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  console.log("auth-router.js, user_name, password", user_name, password )

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      })

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser){
        console.log("auth-router.js, dbUser NOT FOUND", dbUser)
        return res.status(400).json({
          error: "Incorrect user_name or password",
        })}
       
        console.log("auth-router.js, dbUser", dbUser)

      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect user_name or password",
          })

        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
