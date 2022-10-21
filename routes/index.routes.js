const router = require ('express').Router()

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require ('./auth.routes.js');
router.use('/auth', authRoutes);

const profileRoutes = require ('./profile.routes.js');
router.use('/profile', profileRoutes);

const professionalRoutes = require ('./professional.routes.js');
router.use('/professional', professionalRoutes);

module.exports = router;
