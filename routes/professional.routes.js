const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');


// GET /profile/list - render to user signup
router.get("/list", isLoggedIn, (req, res, next) => {
    res.render("professional/list.hbs");
  });



module.exports = router;