module.exports = function (config) {
    var express = require('express');
    var session = require('express-session');
    var passport = require('passport');
    var wsfedsaml2 = require('passport-azure-ad').WsfedStrategy;
    var waad = require('node-waad');
    var app = express.Router();

    // store session info in memory
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }))

    // add passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        if (req.isAuthenticated() || req.url === "/login" || req.url === "/login/callback") {
            next()
        }
        else {
            res.redirect('/login')
        }
    })

    var wsfedStrategy = new wsfedsaml2(config.wsfed,
        function (profile, done) {
            return done(null, profile)
        });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login')
    }

    passport.use(wsfedStrategy);

    passport.serializeUser(function (user, cb) {
        cb(null, user)
    });

    var users = [];

    passport.deserializeUser(function (user, done) {
        done(null, user)
    });

    // send the user to WAAD to authenticate
    app.get('/login', passport.authenticate('wsfed-saml2', {
        failureRedirect: '/',
        failureFlash: true
    }), function (req, res) {
        res.redirect('/');
    });

    // callback from WAAD with a token
    app.post('/login/callback', passport.authenticate('wsfed-saml2', {
        failureRedirect: '/',
        failureFlash: true
    }), function (req, res) {
        res.redirect('/');
    });
    
    return app;
}

