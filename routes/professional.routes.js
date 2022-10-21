const router = require ('express').Router()
const { isLoggedIn, isAdmin } = require('../middlewares/auth');



module.exports = router;

// GET "/professional/signup"
router.get("/signup", (req, res, next) => {
    res.render("professional/signup.hbs")
})


//POST "/professional/signup"
router.post("/login", async (req, res, next) => {
    const { cif, password } = req.body

    if (cif === "" || password === "") {
        res.render("professional/login.hbs", {
          errorMessage: "All fields must be completed",
        });
        return;
    }
    try {
        const foundProfessional = await Professional.findOne({email});
        if (foundProfessional === null) {
          res.render("professional/login.hbs", {
            errorMessage: "incorrect email address or password",
          });
          return;
        }
        // 2. Verifing password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, foundProfessional.password);
        console.log("isPasswordValid", isPasswordValid);
        if (!isPasswordValid) {
          res.render("professional/login.hbs", {
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
          res.redirect("/profile/list");
        });
      } catch (error) {
        next(error);
      }
    
})