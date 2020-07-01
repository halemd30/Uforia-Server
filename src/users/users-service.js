const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/;

const UsersService = {
  hasUserWithUsername(db, username) {
    return db("users")
      .where({ username })
      .first()
      .then((user) => user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length <= 7) {
      return "Password must be at least 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case and number";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 8);
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      phone_number: user.phone_number,
    };
  },
};

module.exports = UsersService;
