const router = require("express").Router();
const { isLoggedIn, isAdmin, isProfessional } = require("../middlewares/auth");
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");
const cloudinary = require("../middlewares/cloudinary.js");

// "/professional/:routes"
// GET render professional/list.hbs with Property.find() method in listProperties variable
router.get("/list", isProfessional, async (req, res, next) => {
  try {
    let listProperties = await Property.find();
    res.render("professional/list.hbs", {
      listProperties,
    });
  } catch (error) {
    next(error);
  }
});

// GET search Professional with same "req.session.professionalOnline._id"
router.get("/profile", isProfessional, (req, res, next) => {
  const foundProf = req.session.professionalOnline;

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

// GET search Professional with req.params info(id)
router.get("/edit/:profileId", isProfessional, (req, res, next) => {
  let { profileId } = req.params;

  Professional.findById(profileId)
    .then((details) => {
      res.render("professional/edit-professional.hbs", {
        details,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// POST '/profile/edit/:profileId'
router.post(
  "/edit/:professionalId",
  isProfessional,
  cloudinary.single("professional-img"),
  (req, res, next) => {
    let { professionalId } = req.params;
    const { name, cif, email, phone, role } = req.body;

    const professionalUpdate = {
      name,
      cif,
      email,
      phone,
      img: req.file?.path,
      role,
    };
    //Search Profesional and update dates from edit-professionals.hbs
    Professional.findByIdAndUpdate(professionalId, professionalUpdate)
      .then(() => {
        res.redirect(`/professional/profile`);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// POST delete Professional with req.params
router.post("/delete/:professionalId", isProfessional, (req, res, next) => {
  Professional.findByIdAndDelete(req.params.professionalId)
    .then(() => {
      req.session.destroy(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/listedProfessionals", async (req, res, next) => {
  try {
    let professionalList = await Professional.find();
    res.render("professional/all-professionals.hbs", { professionalList });
  } catch (error) {
    next(error);
  }
});

//GET render professional/promote-list.hbs and gives relation to User.properties
router.get("/promote", isProfessional, async (req, res, next) => {
  try {
    let response = await Professional.findById(
      req.session.professionalOnline._id
    ).populate("properties");
    res.render("professional/promote-list.hbs", {
      favouriteList: response.properties,
    });
  } catch (error) {
    next(error);
  }
});

// POST get data from details.hbs form, use req.session for search userActive id and $addToSet properties with req.params
router.post("/promote/:propertyId", isProfessional, async (req, res, next) => {
  const { propertyId } = req.params;
  const foundUser = req.session.professionalOnline;

  try {
    await Professional.findByIdAndUpdate(foundUser._id, {
      $addToSet: { properties: propertyId },
    });
    res.redirect("/professional/list");
  } catch (error) {
    next(error);
  }
});

//POST search req.sesion id and delete with pull method
router.post(
  "/promote/:propertyId/delete",
  isProfessional,
  async (req, res, next) => {
    let { propertyId } = req.params;
    const foundUser = req.session.professionalOnline;

    try {
      await Professional.findByIdAndUpdate(foundUser._id, {
        $pull: { properties: propertyId },
      });
      res.redirect("/professional/promote");
    } catch (error) {
      next(error);
    }
  }
);

//GET render professional/details.hbs with "modified" timeStamp properties and gives relation with populate to Porperty.owner
router.get("/details/:propertyId", isProfessional, async (req, res, next) => {
  let { propertyId } = req.params;

  try {
    let details = await Property.findById(propertyId).populate("owner");
    let created =
      new Date().toLocaleDateString() +
      " at " +
      new Date().toLocaleTimeString();
    let updated =
      new Date().toLocaleDateString() +
      " at " +
      new Date().toLocaleTimeString();

    res.render("professional/details.hbs", {
      details,
      created,
      updated,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
