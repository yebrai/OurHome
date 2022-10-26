const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");
const User = require('../models/User.model.js');

router.get("/index", (req, res, next) => {
    res.render("admin/index.hbs")
})

router.get("/users-list", async(req, res, next) => {
    
    try {
        let propertiesList = Property.find()
        res.render("admin/users.hbs", {propertiesList})
        
    } catch (error) {
        next(error)
    }

})
router.get("/professionals-list", (req, res, next) => {
    res.render("admin/professionals.hbs")
})
router.get("/properties-list", (req, res, next) => {
    res.render("admin/properties.hbs")
})



module.exports = router;
