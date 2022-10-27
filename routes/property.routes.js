const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js");


// GET '/list' render "property/list.hbs" with Property sorted
router.get("/list", async (req, res, next) => {
  try {
    let listProperties = await Property.find().populate("owner").sort({createdAt: -1})
    res.render("property/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});


// POST /list/location use data from "index.hbs" for find Property with filter
router.post("/list/location", async (req, res, next) => {
  try {
    let listProperties = await Property.find( {location: {$in: req.body.location } } )
    res.render("property/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

// GET /property/create use user-data in "house-create.hbs" => owner
router.get("/create", isLoggedIn, async (req, res, next) => {
  try {
    const userList = await User.findById(req.session.userOnline._id);
    res.render("property/house-create.hbs", 
    {userList}
    );
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
     
    let amenitiesArr = [];
    for(let key in req.body){
      if(req.body[key] === 'on'){
        amenitiesArr.push(key)
      }
    }

    try {
      let newProperty = {
        name,
        location,
        m2,
        img: req.file?.path,
        owner: req.session.userOnline._id,
        amenities: amenitiesArr,
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
router.get("/details/:propertyId", (req, res, next) => {
  const { propertyId } = req.params;
  
  Property.findById(propertyId)
  .populate('owner')
  .then((details) => {     
    let created = new Date().toLocaleDateString() + " at " + new  Date().toLocaleTimeString()
    let updated = new Date().toLocaleDateString() + " at " + new  Date().toLocaleTimeString()
    
    let myIdCompair = details.owner._id.toString()
    if (req.session.userOnline._id === myIdCompair) {
      sameOwner = true
    } else { sameOwner = false }
      res.render("property/details.hbs", {
        details,
        sameOwner,
        created,
        updated
      });
    })
    .catch((err) => {
      res.redirect("/auth/login");
    });
});

// GET '/property/edit/:propertyId' - render property-edit
router.get("/edit/:propertyId", isLoggedIn, (req, res, next) => {
  let { propertyId } = req.params;

  
  Property.findById(propertyId)
    .populate("owner")
    .then((details) => {
      let myIdCompair = details.owner._id.toString()
      if (req.session.userOnline._id === myIdCompair) {
        sameOwner = true
      } else { sameOwner = false }
      res.render("property/edit-property.hbs", {
        sameOwner,
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/property/edit/:propertyId' - update property data
router.post("/edit/:propertyId", isLoggedIn,  cloudinary.single("img"), (req, res, next) => {
  let { propertyId } = req.params;
  const {
    name,
    location,
    m2,
    owner,
    amenities,
    price,
  } = req.body;

  const propertyUpdate = {
    name,
    location,
    m2,
    img: req.file?.path,
    owner,
    amenities,
    price,
  };

  Property.findByIdAndUpdate(propertyId, propertyUpdate)
    .then(() => {
      res.redirect(`/property/details/${propertyId}`);
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/property/delete/:propertyId' - delete property
router.post("/delete/:propertyId", isLoggedIn, async (req, res, next) => {
  let foundUser = req.session.userOnline
  try {
    let home = await Property.findByIdAndDelete(req.params.propertyId)
        res.redirect("/property/list");
  
     await User.findByIdAndUpdate(foundUser._id, { $pull: {properties: home._id}})
    
  } catch (error) {
    next(error)
    
  }
});

module.exports = router;
