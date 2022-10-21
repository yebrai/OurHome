const isLoggedIn = (req,res,next) => {
    if (req.session.userOnline === undefined){
        res.redirect('/auth/login')
    }else{
        next()
    }
}

const isAdmin = (req,res,next) => {
    if (req.session.userOnline === undefined || req.session.userOnline !== 'admin' ){
        res.redirect('/auth/login')
    }else{
        next()
    }
}

module.exports = {
    isLoggedIn,
    isAdmin
}