const router = require ('express').Router()
const { isLoggedIn, isAdmin } = require('../middlewares/auth');



module.exports = router;

// GET "/professional/signup"
router.get("/signup", (req, res, next) => {
    res.render("professional/signup.hbs")
})