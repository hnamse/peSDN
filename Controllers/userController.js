const Users = require('../models/Users');
const bcrypt = require("bcrypt");
const passport = require('passport');

class UserController {

    loginIndex(req, res, next) {
        res.render('login', {
            title: 'Login page',
            userId: req.user
        })
    };

    login(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/users/dashboard',
            failureRedirect: '/users/login/',
            failureFlash: true
        })(req, res, next);
    }

    dashboard(req, res, next) {
        Users.find({})
            .then((users) => {
                res.render('dashboard', {
                    title: 'Admin page',
                    userId: req.user,
                    users: users
                })
            })


    };

    logout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            req.flash('success_msg', 'You are logged out');
            res.redirect('/users/login');
        });
    }

    regisIndex(req, res, next) {
        res.render('register', {
            title: 'Register page',
            userId: req.user
        });
    };

    register(req, res, next) {

        let user = req.body;
        let errors = [];

        if (!user.username) {
            errors.push({ msg: 'Please enter username' });
        }
        if (!user.password) {
            errors.push({ msg: 'Please enter password' });
        }
        if (!user.name) {
            errors.push({ msg: 'Please enter your name' });
        }
        if (!user.yob) {
            errors.push({ msg: 'Please enter your year of birth' });
        }
        if (user.password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }
        if (user.password !== user.retypePassword) {
            errors.push({ msg: 'Retype password does not match' });
        }

        if (errors.length > 0) {
            res.render('register', {
                errors,
                user
            });
        }
        else {
            Users.findOne({ username: user.username }).then(user => {
                if (user) {
                    errors.push({ msg: 'Username already exists' });
                    res.render('register', {
                        errors,
                        user
                    });
                }
                else {
                    const newUser = new Users(req.body);
                    //Hash password
                    bcrypt.hash(newUser.password, 10, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.redirect('/users/login');
                            })
                            .catch(next);
                    });
                }
            });
        }
    }

    delete(req, res, next) {
        Users.findByIdAndDelete({ _id: req.params.userId })
            .then(() => res.redirect('/users/dashboard'))
            .catch(next);
    }

    updateForm(req, res, next) {
        const userId = req.params.userId;
        Users.findById(userId)
            .then((user) => {
                res.render('editUser', {
                    title: 'The detail of user',
                    user: user,
                    userId: req.user
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateProfile(req, res, next) {
        Users.updateOne({ _id: req.params.userId }, req.body)
            .then(() => {
                res.redirect(`/users/edit/${req.params.userId}`)
            })
            .catch(next)
    }

    changePassword(req, res, next) {
        let newPassword = req.body.newPassword;
        let retypePassword = req.body.retypePassword;
        var oldPassword = req.body.oldPassword;
        var defaultPassword = "";
        console.log(req.body);

        if (!newPassword || !retypePassword || !oldPassword) {
            res.render('changePassword', {
                title: 'Change Password page',
                message: "Please fill all the field",
                userId: req.user
            });
        }

        Users.findById(req.user._id).then((user) => {

            defaultPassword = user.password;

            const matchPassword = bcrypt.compare(oldPassword, defaultPassword, function (err, result) {
                if (result) {
                    return false
                } else {
                    return true
                }
            });

            if (retypePassword !== newPassword) {
                res.render('changePassword', {
                    title: 'Change Password page',
                    message: "New password do not match",
                    userId: req.user
                });
            } else if (matchPassword) {
                res.render('changePassword', {
                    title: 'Change Password page',
                    message: "Wrong password",
                    userId: req.user
                });
            } else {
                bcrypt.hash(newPassword, 10, function (err, hash) {
                    if (err) throw err;
                    newPassword = hash;
                    Users.updateOne({ _id: req.user._id },{ $set: { password: newPassword } })
                        .then(() => {
                            res.render('changePassword', {
                                title: 'Change Password page',
                                message: "change password successful",
                                userId: req.user
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                });

            }

        }).catch((error) => {
            console.log(error);
        })
    }

    changePasswordForm(req, res, next) {
        res.render('changePassword', {
            title: 'Change Password page',
            message: '',
            userId: req.user
        });
    }

}

module.exports = new UserController;