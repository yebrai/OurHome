const router = require ('express').Router()
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");


// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST /auth/signup - render to user signup/create user
router.post("/signup", async (req, res, next) => {
  const { name, surname, email, phone, password, passwordConfirmation } =
    req.body;
  // 1. Guard clause.
  if (
    name === "" ||
    surname === "" ||
    email === "" ||
    password === "" ||
    passwordConfirmation === ""
  ) {
    res.render("auth/signup.hbs", {
      errorMessage: "Introducir caracteres"
    });
    return;
  }
  // 2. Password validation.
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "Introducir caracteres validos"
    });
    return;
  }
  // 2.1 Password confirmation.
  if (passwordConfirmation !== password) {
    res.render("auth/signup.hbs", {
      errorMessage: "the password confirmation must be same than password",
    });
    return;
  }
  // 2.2 User confirmation.
  try {
    const foundUser = await User.findOne({ name: name });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "El usuario ingresado ya existe con su nombre",
      });
      return;
    }
    // 3. Generate salt & hash password.
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    // 4. Create User.
    let newUser = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      password: hashPassword,
    };

    await User.create(newUser);
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// GET /auth/login - render to user login
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST /auth/login - render to user login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //1. Backend validations
  //1.1 Fields completed
  if (email === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "All fields must be completed",
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
    if (!isPasswordValid) {
      res.render("auth/login.hbs", {
        errorMessage: "incorrect email address or password",
      });
      return;
    }
    // 3. implement session sistem

    //User is active
    req.session.userOnline = foundUser;
    console.log(req.session.userOnline)

    req.session.save(() => {
      // 4. redirects to private page
      if (req.session.userOnline.role === "admin") {
      res.redirect("/admin/index");
      }
      else{res.redirect("/property/list")}
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


module.exports = router;

