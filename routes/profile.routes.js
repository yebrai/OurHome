const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js");

// "/profile/:routes

//GET render "profile/my-profile.hbs" with req.session "id"
router.get("/", isLoggedIn, (req, res, next) => {
  const foundUser = req.session.userOnline;
  User.findById(foundUser._id)
    .then((details) => {
      res.render("profile/my-profile.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET render profile/edit-user.hbs with req.params data
router.get("/edit/:profileId", isLoggedIn, (req, res, next) => {
  let { profileId } = req.params;

  User.findById(profileId)
    .then((details) => {
      res.render("profile/edit-user.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST get data from  "edit/user.hbs" and use req.params data for search and update it
router.post(
  "/edit/:profileId",
  isLoggedIn,
  cloudinary.single("img"),
  (req, res, next) => {
    let { profileId } = req.params;
    const { name, surname, email, password, phone, role, properties } =
      req.body;

    const userUpdate = {
      name,
      surname,
      email,
      password,
      phone,
      img: req.file?.path,
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
  }
);

// POST use req.params data from "edit-user.hbs" to delete it
router.post("/delete/:profileId", isLoggedIn, (req, res, next) => {
  User.findByIdAndDelete(req.params.profileId)
    .then(() => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET render "profile/favourite-list.hbs" with req.session data, finding User and populate with User.favourite arr
router.get("/favourites", isLoggedIn, async (req, res, next) => {
  const foundUser = req.session.userOnline;
  try {
    let response = await User.findById(foundUser._id).populate("favourite");
    res.render("profile/favourite-list.hbs", {
      favouriteList: response.favourite,
    });
  } catch (error) {
    next(error);
  }
});

//POST use "property/list.hbs" data for search and push element
router.post("/favourites/:propertyId", isLoggedIn, async (req, res, next) => {
  const { propertyId } = req.params;
  const foundUser = req.session.userOnline;

  try {
    await User.findByIdAndUpdate(foundUser._id, {
      $addToSet: { favourite: propertyId },
    });
    res.redirect("/property/list");
  } catch (error) {
    next(error);
  }
});

//POST use "profile/favourite-lis.hbs" for get req.params data and remove foundUser.favourite property element with pull
router.post(
  "/favourites/:propertyId/delete",
  isLoggedIn,
  async (req, res, next) => {
    let { propertyId } = req.params;
    const foundUser = req.session.userOnline;

    try {
      await User.findByIdAndUpdate(foundUser._id, {
        $pull: { favourite: propertyId },
      });
      res.redirect("/profile/favourites");
    } catch (error) {}
  }
);
module.exports = router;
