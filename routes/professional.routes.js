const router = require ('express').Router()
const Professional = require ('../models/Professional.model.js')
const bcrypt = require("bcryptjs");
const { isLoggedIn, isAdmin } = require('../middlewares/auth');




// GET "/professional/signup"
router.get("/signup", (req, res, next) => {
    res.render("professional/signup.hbs")
})

// POST "/professional/signup"
router.post("/signup", async (req, res, next) => {
    const { name, cif, email, password, passwordConfirmation } =
      req.body;
    // 1. Guard clause.
    if (
      name === "" ||
      cif === "" ||
      email === "" ||
      password === "" ||
      passwordConfirmation === ""
    ) {
      res.render("professional/signup.hbs", {
        errorMessage: "Introducir caracteres",
      });
      return;
    }
    // 2. Password validation.
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    if (passwordRegex.test(password) === false) {
      res.render("professional/signup.hbs", {
        errorMessage: "Introducir caracteres validos",
      });
      return;
    }
    // 2.1 Password confirmation.
    if (passwordConfirmation !== password) {
      res.render("professional/signup.hbs", {
        errorMessage: "the password confirmation must be same than password",
      });
      return;
    }
    // 2.2 User confirmation.
    try {
      const foundProfessional = await Professional.findOne({ name: name });
      if (foundProfessional !== null) {
        res.render("professional/signup.hbs", {
          errorMessage: "El usuario ingresado ya existe con su nombre",
        });
        return;
      }
      // 3. Generate salt & hash password.
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);
      // 4. Create Professional.
      let newProfessional = {
        name: name,
        cif: cif,
        email: email,
        password: hashPassword,
      };
      
      await Professional.create(newProfessional);
      console.log(req.body);
      res.redirect("/professional/login");
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
