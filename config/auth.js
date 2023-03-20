class auth  {
    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in first!');
        res.redirect('/users/login');
    }

    isAdmin(req, res, next) {
        if (req.user && req.user.isAdmin) {
            return next();
        }else{
            res.redirect('/users/login');
        }
        req.flash('error_msg', 'admin path');
        res.redirect('/players');
    }

    checkLogined(req, res, next){
        if (!req.user) {
            return next();
        }
        res.redirect('/players');
    }
}

module.exports = new auth;
