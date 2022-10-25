const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js")


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
router.get("/profile", isProfessional, (req, res, next) => {
  const foundProf = req.session.professionalOnline
  
  Professional.findById(foundProf._id)
    .then((details) => {
      res.render("professional/profile.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET '/profile/edit/:profileId'
router.get("/edit/:profileId", isProfessional, (req, res, next) => {
  let { profileId } = req.params;

  Professional.findById(profileId)
    .then((details) => {
      console.log(details);
      res.render("professional/edit-professional.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/profile/edit/:profileId'
router.post("/edit/:professionalId", isProfessional, cloudinary.single("professional-img"), (req, res, next) => {
  let { professionalId } = req.params;
  const { name, cif, email, phone, role} =
    req.body;

  const professionalUpdate = {
    name,
    cif,
    email,
    phone,
    img: req.file.path,
    role,
  };
  console.log(professionalUpdate)

  Professional.findByIdAndUpdate(professionalId, professionalUpdate)
    .then(() => {
      res.redirect(`/professional/profile`);
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/profile/delete/:profileId'
router.post("/delete/:professionalId", isProfessional, (req, res, next) => {
  Professional.findByIdAndDelete(req.params.professionalId)
  .then(()=> {
    req.session.destroy(() => {
      res.redirect("/");
    });
  })
  .catch((err) =>{
    next(err)
  })
});


router.get("/listedProfessionals", async (req, res, next) => {

  try {
    let professionalList = await Professional.find()
    res.render("professional/all-professionals.hbs", {professionalList})
    console.log(professionalList)
  } catch (error) {
    next(error)
  }
  
})

//MyPromoted
router.get('/promote', isProfessional, async (req,res,next) => {
  try {

    let response = await  Professional.findById(req.session.professionalOnline._id).populate("properties")
    res.render("professional/promote-list.hbs", { 
      favouriteList: response.properties
    })
    console.log(response)
    
  } catch (error) {
    next(error)
  }
})

// Necesitamos extraer la info de la ruta de abajo.
router.post('/promote/:propertyId', isProfessional, async (req,res,next) => {
  const {propertyId} = req.params
  const foundUser = req.session.professionalOnline

  try {
     await Professional.findByIdAndUpdate(foundUser._id, { $addToSet: {properties: propertyId}})
    res.redirect("/professional/list")
  } catch (error) {
    next(error)
  }
})

router.post("/promote/:propertyId/delete", isProfessional, async (req, res, next) => {
  let {propertyId} = req.params
  const foundUser = req.session.professionalOnline
 
  try {
    await Professional.findByIdAndUpdate(foundUser._id, { $pull: {properties: propertyId}})
    res.redirect("/professional/promote")
  } catch (error) {
    next(error)
  }

})

router.get("/details/:propertyId", isProfessional, async (req,res,next) => {
  let {propertyId} = req.params

  try {
    let details = await Property.findById(propertyId).populate('owner')
    let timeConverter = details.createdAt.toString()
    let hours = timeConverter.slice(16,-35)
    let date = timeConverter.slice(0,-44)
    let time = `${date}, ${hours}`
    console.log(hours);

    console.log(details);
    res.render('professional/details.hbs',{
      details,
      time

    })
    
  } catch (error) {
    next(error)
  }

})



module.exports = router;