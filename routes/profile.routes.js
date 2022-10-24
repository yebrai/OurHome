const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js")


//GET "/Profile"
router.get("/", isLoggedIn, (req, res, next) => {
  User.find()
    .then((details) => {
      res.render("profile/my-profile.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET '/profile/edit/:profileId'
router.get("/edit/:profileId", isLoggedIn, (req, res, next) => {
  let { profileId } = req.params;

  User.findById(profileId)
    .then((details) => {
      console.log(details);
      res.render("profile/edit-user.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/profile/edit/:profileId'
router.post("/edit/:profileId", isLoggedIn, cloudinary.single("img"), (req, res, next) => {
  let { profileId } = req.params;
  const { name, surname, email, password, phone, role, properties } =
    req.body;
  
  const userUpdate = {
    name,
    surname,
    email,
    password,
    phone,
    img: req.file.path,
    role,
    properties,
  };

  User.findByIdAndUpdate(profileId, userUpdate)
    .then(() => {
      res.redirect(`/profile`);
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/profile/delete/:profileId'
router.post("/delete/:profileId", isLoggedIn, (req, res, next) => {
  User.findByIdAndDelete(req.params.profileId)
  .then(()=> {
    req.session.destroy(() => {
      res.redirect("/");
    });
  })
  .catch((err) =>{
    next(err)
  })
});



module.exports = router;
