const router = require ('express').Router()
const { isLoggedIn, isAdmin, isProfessional } = require('../middlewares/auth');
const Professional = require("../models/Professional.model.js");
const Property = require("../models/Property.model");
const User = require('../models/User.model.js');





module.exports = router;
