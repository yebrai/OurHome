const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');


// GET /profile/list - render to user signup
router.get("/list", isProfessional, (req, res, next) => {
    res.render("professional/list.hbs");
  });



module.exports = router;