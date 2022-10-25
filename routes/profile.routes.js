const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js")


//GET "/Profile"
router.get("/", isLoggedIn, (req, res, next) => {
  const foundUser = req.session.userOnline
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



// GET '/profile/favourite/'
router.get('/favourites', isLoggedIn, async (req,res,next) => {
  const foundUser = req.session.userOnline
  try {

    let response = await  User.findById(req.session.userOnline._id).populate("favourite")
    res.render("profile/favourite-list.hbs", { 
      favouriteList: response.favourite
    })

    
  } catch (error) {
    next(error)
  }
})

// Necesitamos extraer la info de la ruta de abajo.
router.post('/favourites/:propertyId', isLoggedIn, async (req,res,next) => {
  const {propertyId} = req.params
  const foundUser = req.session.userOnline

  console.log("found user:", foundUser,"propertyId", propertyId)
  try {
    await User.findByIdAndUpdate(foundUser._id, { $addToSet: {favourite: propertyId}})
    res.redirect("/property/list")
  } catch (error) {
    next(error)
  }
})

router.post("/favourites/:propertyId/delete", isLoggedIn, async (req, res, next) => {
  let {propertyId} = req.params
  console.log(propertyId)
  const foundUser = req.session.userOnline
 
  try {
    await User.findByIdAndUpdate(foundUser._id, { $pull: {favourite: propertyId}})
    res.redirect("/profile/favourites")
  } catch (error) {
    
  }

})
module.exports = router;
