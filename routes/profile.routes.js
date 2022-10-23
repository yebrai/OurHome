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

module.exports = router;
