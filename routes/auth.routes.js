const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

router.post('/signup', (req, res, next) => {
    const { username, surname, email, password } = req.body;

    if ( !username === '' || surname){}


})

// GET /auth/login - render to user login
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST /auth/login - render to user login
router.post("/auth/login", async (req, res, next) => {
   const { email, password } = req.body

    //1. Backend validations
    //1.1 Fields completed
    if ( !email || !password ) {
        res.render("auth/login.hbs", {
          errorMessage: "usuario ya creado con ese nombre",
        });
        return;
      }

      //1.2 Account exist
  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "Account or password incorrect",
      });
      return;
    }
    // 2. Verifing password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "incorrect email address or password",
      });
      return;
    }
    // 3. implement session sistem

    //User is active
    req.session.userOnline = foundUser;

    req.session.save(() => {
      // 4. redirects to private page
      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
