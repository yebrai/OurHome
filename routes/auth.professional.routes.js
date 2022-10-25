const router = require ('express').Router()
const Professional = require ('../models/Professional.model.js')
const bcrypt = require("bcryptjs");
const { isLoggedIn, isAdmin } = require('../middlewares/auth');



router.get("/", (req, res, next) => {
    res.render("professional/profile.hbs")
})

// GET "/professional/signup"
router.get("/signup", (req, res, next) => {
    res.render("auth/signup-professional.hbs")
})

router.get("/login", (req, res, next) => {
    res.render("auth/login-professional.hbs")
})



//POST "/professional/login"
router.post("/login", async (req, res, next) => {
    const { cif, password } = req.body

    if (cif === "" || password === "") {
        res.render("auth/login-professional.hbs", {
          errorMessage: "All fields must be completed",
        });
        return;
    }
    try {
        const foundProfessional = await Professional.findOne({cif});
        if (foundProfessional === null) {
          res.render("auth/login-professional.hbs", {
            errorMessage: "incorrect email address or password",
          });
          return;
        }
        // 2. Verifing password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, foundProfessional.password);
        console.log("isPasswordValid", isPasswordValid);
        if (!isPasswordValid) {
          res.render("auth/login-professional.hbs", {
            errorMessage: "incorrect email address or password",
          });
          return;
        }
        // 3. implement session sistem
    
        //User is active
        req.session.professionalOnline = foundProfessional;
        console.log(req.session.professionalOnline)
    
        req.session.save(() => {
          // 4. redirects to private page
          res.redirect("/professional/list");
        });
      } catch (error) {
        next(error);
      }
    
})
// POST "/professional/signup"
router.post("/signup", async (req, res, next) => {
    const { name, cif, email, password, passwordConfirmation, phone } =
      req.body;
    // 1. Guard clause.
    if (
      name === "" ||
      cif === "" ||
      email === "" ||
      password === "" ||
      passwordConfirmation === ""
    ) {
      res.render("auth/signup-professional.hbs", {
        errorMessage: "Introducir caracteres",
      });
      return;
    }
    // 2. Password validation.
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    if (passwordRegex.test(password) === false) {
      res.render("auth/signup-professional.hbs", {
        errorMessage: "Introducir caracteres validos",
      });
      return;
    }
    // 2.1 Password confirmation.
    if (passwordConfirmation !== password) {
      res.render("auth/signup-professional.hbs", {
        errorMessage: "the password confirmation must be same than password",
      });
      return;
    }
    // 2.2 User confirmation.
    try {
      const foundProfessional = await Professional.findOne({ name: name });
      if (foundProfessional !== null) {
        res.render("auth/signup-professional.hbs", {
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
        phone: phone
      };
      
      await Professional.create(newProfessional);
      console.log(req.body);
      res.redirect("/professional/login");
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
