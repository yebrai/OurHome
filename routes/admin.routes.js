const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");
const User = require("../models/User.model.js");

// "/admin/:routes"

router.get("/index", isAdmin, (req, res, next) => {
  res.render("admin/index.hbs");
});

// This GETS, render admin views
router.get("/users-list", isAdmin, async (req, res, next) => {
  try {
    let usersList = await User.find();
    res.render("admin/users.hbs", { usersList });
  } catch (error) {
    next(error);
  }
});
router.get("/properties-list", isAdmin, async (req, res, next) => {
  try {
    let propertiesList = await Property.find();
    res.render("admin/properties.hbs", { propertiesList });
  } catch (error) {
    next(error);
  }
});

router.get("/professionals-list", isAdmin, async (req, res, next) => {
  try {
    let professionalsList = await Professional.find();
    res.render("admin/professionals.hbs", { professionalsList });
  } catch (error) {
    next(error);
  }
});

//This POSTS, get view data for delete element
router.post("/user/:elemId/delete", isAdmin, async (req, res, next) => {
  let { elemId } = req.params;
  try {
    await User.findByIdAndDelete(elemId);
    res.redirect("/admin/users-list");
  } catch (error) {
    next(error);
  }
});

router.post("/property/:elemId/delete", isAdmin, async (req, res, next) => {
  let { elemId } = req.params;
  try {
    await Property.findByIdAndDelete(elemId);
    res.redirect("/admin/properties-list");
  } catch (error) {
    next(error);
  }
});

router.post("/professional/:elemId/delete", isAdmin, async (req, res, next) => {
  let { elemId } = req.params;
  try {
    await Professional.findByIdAndDelete(elemId);
    res.redirect("/admin/professionals-list");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
