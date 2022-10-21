const express = require ('express');
const router = express.Router();


module.exports = router;

// GET /auth/signup - render to user signup
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})