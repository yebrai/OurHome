const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

router.post('/signup', (req, res, next) => {
    const { username, surname, email, password } = req.body;

    if ( !username === '' || surname)


})

// GET /auth/login - render to user login
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST /auth/login - render to user login
router.post("/")