const express = require ('express');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const User = require('../models/User.model');
const router = express.Router();


router.get('/', isLoggedIn, (req,res,next) => {
    User.findById(req.session.userOnline._id)
    .then((response) => {
        res.render('profile/my-profile.hbs', {
            userInfo : response
        })
    })
    .catch((err) => {
        next(err)
    })
})

router.get('/create', isLoggedIn, (req,res,next) => {
    res.render ('profile/house-create.hbs')
})

module.exports = router;