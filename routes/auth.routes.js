const express = require ('express');
const router = express.Router();


module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// GET /auth/login - render to user login
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST /auth/login - render to user login
router.post("/")