const router = require ('express').Router()
const { isLoggedIn, isAdmin } = require('../middlewares/auth');



module.exports = router;