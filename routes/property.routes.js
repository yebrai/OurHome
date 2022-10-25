const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js");

// GET /property/list - render to user signup
router.get("/list", async (req, res, next) => {
  try {
    let listProperties = await Property.find().populate("owner")
    res.render("property/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

// POST /property/list - render to user signup
router.post("/list", async (req, res, next) => {
  try {
    let listProperties = await Property.find()
    res.render("property/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

// GET /property/create - render to user create
router.get("/create", isLoggedIn, async (req, res, next) => {
  try {
    // antes de renderizar, voy a buscar todos los autores de la BD
    const userList = await User.findById(req.session.userOnline);
    console.log(userList);
    res.render("property/house-create.hbs", {userList});
  } catch (error) {
    next(error);
  }
});

// POST /property/create - render to property create
router.post("/create", isLoggedIn, cloudinary.single("property-img"), async (req, res, next) => {
    const {
      name,
      location,
      m2,
      apartmentFor,
      style,
      owner,
      amenities,
      price,
      professional,
    } = req.body;
    // 1. Guard clause.
    if (name === "" || price === "") {
      res.render("property/house-create.hbs", {
        errorMessage: "Introducir nombre y valor",
      });
      return;
    }

    try {
      let newProperty = {
        name,
        location,
        m2,
        img: req.file.path,
        apartmentFor,
        style,
        owner: req.session.userOnline._id,
        amenities,
        price,
        professional,
      };

      await Property.create(newProperty);
      res.redirect("/property/list");
    } catch (error) {
      next(error);
    }
  }
);

// GET '/property/details/:id' - render property-details
router.get("/details/:propertyId", isLoggedIn, (req, res, next) => {
  const { propertyId } = req.params;
  
  Property.findById(propertyId)
  .populate('owner')
  .then((details) => {     
      console.log(details);
      res.render("property/details.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET '/property/edit/:propertyId'
router.get("/edit/:propertyId", isLoggedIn, (req, res, next) => {
  let { propertyId } = req.params;

  Property.findById(propertyId)
    .populate("owner")
    .then((details) => {
      console.log(details);
      res.render("property/edit-property.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/property/edit/:propertyId'
router.post("/edit/:propertyId", isLoggedIn, (req, res, next) => {
  let { propertyId } = req.params;
  const {
    name,
    location,
    m2,
    img,
    apartmentFor,
    style,
    owner,
    amenities,
    price,
    professional,
  } = req.body;

  const propertyUpdate = {
    name,
    location,
    m2,
    img,
    apartmentFor,
    style,
    owner,
    amenities,
    price,
    // professional,
  };

  console.log(req.body);
  Property.findByIdAndUpdate(propertyId, propertyUpdate)
    .then(() => {
      res.redirect(`/property/details/${propertyId}`);
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/property/delete/:propertyId'
router.post("/delete/:propertyId", isLoggedIn, (req, res, next) => {
  Property.findByIdAndDelete(req.params.propertyId)
    .then(() => {
      res.redirect("/property/list");
    })
    .catch((err) => {
      next(err);
    });
});

// router.post('/:propertyId/favourite', isLoggedIn, (req,res,next) => {
//   let {propertyId} = req.params

// })

module.exports = router;
