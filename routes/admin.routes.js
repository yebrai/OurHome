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
        let usersList = await User.find()
        res.render("admin/users.hbs", {usersList})
        
    } catch (error) {
        next(error)
    }

})
router.get("/properties-list", async (req, res, next) => {
    try {
        let propertiesList = await Property.find()
        res.render("admin/properties.hbs", {propertiesList})
        console.log(propertiesList)
        
    } catch (error) {
        next(error)
    }
})

router.get("/professionals-list", async(req, res, next) => {
    try {
        let professionalsList = await Professional.find()
        res.render("admin/professionals.hbs", {professionalsList})
    }
    catch (error) {
        next(error)
    }
})


module.exports = router;
