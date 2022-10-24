const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const User = require("../models/User.model");
const Property = require("../models/Property.model");


// GET /property/create - render to user create
router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("property/house-create.hbs");
  });

// POST /property/create - render to property create
router.post("/create", isLoggedIn, async (req, res, next) => {
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
        img,
        apartmentFor,
        style,
        owner,
        amenities,
        price,
        professional,
      };
  
      await Property.create(newProperty);
      res.redirect("/property/list");
    } catch (error) {
      next(error);
    }
  });

// GET /property/list - render to user signup
router.get("/list", isLoggedIn, async (req, res, next) => {
    try {
      let listProperties = await Property.find();
    //   console.log(listProperties);
      res.render("property/list.hbs", {
        listProperties,
      });
    } catch (error) {
      next(error);
    }
  });

// GET '/property/details/:id' - render property-details
router.get('/details/:propertyId', isLoggedIn, (req,res,next) => {
    const {propertyId} = req.params

    Property.findById(propertyId)
    .then((details) => {
      // console.log(details);
      res.render('property/details.hbs',{
        details
      })
    })
    .catch((err) => {
      next(err)
    })

    // try {
    //     let propertyDetails = Property.findById(propertyId)
    //     res.render('property/details.hbs', {
    //         propertyDetails
    //     })   
    // } catch (error) {
    //     next(error)
    // }
})

// GET '/property/edit/:propertyId'
router.get('/edit/:propertyId', isLoggedIn, (req,res,next) => {
  let {propertyId} = req.params

  Property.findById(propertyId)
  .then((details) => {
    res.render('property/edit-property.hbs', {
      details})
  })
  .catch((err) => {
    next(err)
  })

})

// POST '/property/edit/:propertyId'
router.post('/edit/:propertyId', isLoggedIn, (req,res,next) => {
  let {propertyId} = req.params
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
    // owner,
    amenities,
    price,
    // professional,
  };

  console.log(req.body);
  Property.findByIdAndUpdate(propertyId, propertyUpdate)
  .then(() => {
    res.redirect(`/property/details/${propertyId}`)
  })
  .catch((err) => {
    next(err)
  })
})

// POST '/property/delete/:propertyId'
router.post('/delete/:propertyId', isLoggedIn, (req,res,next) => {

  Property.findByIdAndDelete(req.params.propertyId)
  .then(() => {
    res.redirect('/property/list')
  })
  .catch((err) => {
    next(err)
  })
})

// GET '/property/favourite/'
router.get('/favourite', isLoggedIn, async (req,res,next) => {
  try {
    // let favProperty = Property.
    res.render('property/favourite-list.hbs')
    
  } catch (error) {
    next(error)
  }
})


// router.post('/:propertyId/favourite', isLoggedIn, (req,res,next) => {
//   let {propertyId} = req.params


// })




module.exports = router;
