const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");

// GET /professional/list - render to user signup
router.get("/list", isProfessional, async (req, res, next) => {
  try {
    let listProperties = await Property.find();
  //   console.log(listProperties);
    res.render("professional/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

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






module.exports = router;