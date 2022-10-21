const express = require ('express');
const router = express.Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');

module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

router.post('/signup', async (req, res, next) => {
    const { username, surname, email, password, passwordConfirmation } = req.body;

    if ( !username || !surname || !email || !password || !passwordConfirmation ){
        res.render('auth/signup.hbs', {
            errorMessage: 'Introducir caracteres'
        })
        return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    if(passwordRegex.test(password) === false){
        res.render('auth/signup.hbs', {
            errorMessage: 'Introducir caracteres validos'
        });
        return;
    }

    try {
        const foundUser = await User.findOne({username: username});
        if(foundUser !== null){
            res.render('auth/signup.hbs', {
                errorMessage: 'El usuario ingresado ya existe con su nombre'
            });
            return;
        }

    const salt = await bcrypt.salt(12);
        
    } catch (error) {
        next(error)
    }


})

// GET /auth/login - render to user login
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST /auth/login - render to user login
router.post("/auth/login", (req, res, next) => {
   

})