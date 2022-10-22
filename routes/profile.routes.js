const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");

//GET "/Profile"
router.get("/", isLoggedIn, (req, res, next) => {
  User.findById(req.session.userOnline._id)
    .then((response) => {
      res.render("profile/my-profile.hbs", {
        userInfo: response,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET /profile/create - render to user create
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("profile/house-create.hbs");
});

router.post('/create', isLoggedIn, async (req,res,next) => {
  
})

// GET /profile/list - render to user signup
router.get("/list", isLoggedIn, async (req, res, next) => {
  try {
    let listProperties = await Property.find();
    console.log(listProperties);
    res.render("profile/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
