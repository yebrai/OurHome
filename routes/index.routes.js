const router = require ('express').Router()

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Routes
const authRoutes = require ('./auth.routes.js');
router.use('/auth', authRoutes);

const profileRoutes = require ('./profile.routes.js');
router.use('/profile', profileRoutes);

const authProfessionalRoutes = require ('./auth.professional.routes.js');
router.use('/auth-professional', authProfessionalRoutes);

const professionalRoutes = require ('./professional.routes.js');
router.use('/professional', professionalRoutes);

const propertyRoutes = require ('./property.routes.js');
router.use('/property', propertyRoutes);

const adminRoutes = require ('./admin.routes.js');
router.use('/admin', adminRoutes);


module.exports = router;
