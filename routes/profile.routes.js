const express = require ('express');
const User = require('../models/User.model');
const router = express.Router();

router.get('/', (req,res,next) => {
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

module.exports = router;