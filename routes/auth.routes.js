const express = require ('express');
const router = express.Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

router.post('/signup', async (req, res, next) => {
    const { username, surname, email, password, passwordConfirmation } = req.body;

    if ( !username || !surname || !email || !password || !passwordConfirmation ){
        res.render('auth/signup.hbs', {
            errorMessage: 'Introducir caracteres'
        })
        return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    if(passwordRegex.test(password) === false){
        res.render('auth/signup.hbs', {
            errorMessage: 'Introducir caracteres validos'
        });
        return;
    }

    try {
        const foundUser = await User.findOne({username: username});
        if(foundUser !== null){
            res.render('auth/signup.hbs', {
                errorMessage: 'El usuario ingresado ya existe con su nombre'
            });
            return;
        }

    const salt = await bcrypt.salt(12);
        
    } catch (error) {
        next(error)
    }


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
