/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");


/** login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ token });
        } else {
            throw new ExpressError("Invalid username/password", 400);
        }
    }

    catch (err) {
        return next(err);
    }
});

/** register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign({ username }, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ token });
    }

    catch (err) {
        return next(err);
    }
});

/**
 * {
      "username": "Orly",
      "password": "chorly305",
      "first_name": "Orlando",
      "last_name": "Morales",
      "phone": "7865554444"
}

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9ybHkiLCJpYXQiOjE2MzQwNTkzNjJ9.cthdITlWemcdmPBjW1ywM6kbgK_ljcIfFUy3T8dvfMg"
}
 */
/**
 * {
      "username": "Lulu",
      "password": "lulu305",
      "first_name": "Yuly",
      "last_name": "Alvarez",
      "phone": "7862223333"
}
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikx1bHUiLCJpYXQiOjE2MzQwNTk3NzJ9.uVjlCrb_G4mZSA4lfHpqNjCErns2EkGqOoktYQdJ9lA"
}
 */

/**
 * {
      "username": "Pluto",
      "password": "pluto305",
      "first_name": "Bruno",
      "last_name": "morales",
      "phone": "7862225555"
}

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBsdXRvIiwiaWF0IjoxNjM0MDcwODU2fQ.HoP9iqSBe9JYSk3sotnr4-muQ8jzXi7JpmQojXkjLzI"
}
 */
module.exports = router;
