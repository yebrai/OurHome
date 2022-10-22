const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');
const Professional = require("../models/Professional.model.js");

// GET /professional/profile
router.get('/profile', isProfessional,(req,res,next) => {
  Professional.findById(req.session.professionalOnline._id)
  .then((response) => {
      res.render('professional/profile.hbs', {
          userInfo : response
      })
  })
  .catch((err) => {
      next(err)
  })
})


// GET /professional/list - render to user signup
router.get("/list", isProfessional, (req, res, next) => {
    res.render("professional/list.hbs");
  });



module.exports = router;