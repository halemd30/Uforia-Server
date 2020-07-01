const AuthService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  // gets the auth header
  const authToken = req.get("Authorization") || "";

  // sets u p the bearertoken
  let bearerToken;
  // if the authToken, when converted to lowercase, does not startwith bearer
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    //throw an error
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    //otherwise, slice off the first 8 indexes
    // put the rest into bearerToken
    // Ex. Authorization : Bearer 90878976fd6d7 -> 90878976fd6d7
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    // first, verify that this is even a JWT
    const payload = AuthService.verifyJwt(bearerToken);

    // make query to db looking for a user with a username matching the sub
    // in the JWT payload
    AuthService.getUser(req.app.get("db"), payload.sub)
      .then((user) => {
        if (!user)
          return res.status(401).json({ error: "Unauthorized request" });
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request" });
  }
}

module.exports = {
  requireAuth,
};
