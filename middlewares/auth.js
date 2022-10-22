const isLoggedIn = (req,res,next) => {
    if (!req.session.userOnline){
        res.redirect('/auth/login')
    }else{
        next()
    }
}

const isAdmin = (req,res,next) => {
    if (!req.session.userOnline || req.session.userOnline !== 'admin' ){
        res.redirect('/auth/login')
    }else{
        next()
    }
}

const isProfessional = (req,res,next) => {
    if(!req.session.professionalOnline ){
        res.redirect('/auth/login-professional')
    }else{
        next()
    }
}

module.exports = {
    isLoggedIn,
    isAdmin,
    isProfessional
}