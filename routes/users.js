'use strict';
const express = require('express');
const knex = require('../db/knex');
const router = express.Router();
const bcrypt = require('bcrypt');
const flash = require('flash');
// const Users = function() { return knex('users') };

function authorizedUser(req, res, next) {

    let userID = req.session.user.id;
    if (userID) {
        next();
    }
    else {
        res.redirect('/')
    }

}

function authorizedAdmin(req, res, next) {
    //
}

router.get('/', function(req, res, next) {
    console.log(req.session)
    let user = req.session.user;
    res.render('users/auth', {
        user: user
    })
})

router.get('/signup', function(req, res, next) {
    res.render('users/signup')
})

router.get('/login', function(req, res, next) {
    res.render('users/login');
})

router.post('/signup', function(req, res, next) {
    knex('users').where({
        username: req.body.username
    }).first().then(function(user) {
        if (!user) {
            let hash = bcrypt.hashSync(req.body.hashed_password, 12);
            knex('users').insert({
                username: req.body.username,
                hashed_password: hash,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                admin: req.body.admin
            }).then(function() {
                res.redirect('/auth/login');
            })
        }
        else {
            res.redirect('/users');
        }
    })
})

router.post('/login', function(req, res, next) {
    knex('users').where({
        username: req.body.username
    }).first().then(function(user) {
        if (!user) {
            res.send('no username')
        }
        else {
            bcrypt.compare(req.body.hashed_password, user.hashed_password, function(err, result) {
                if (result) {
                    req.session.user = user;
                    res.cookie("loggedin", true);
                    console.log(req.session.user.id);
                    res.redirect('/auth');
                }
                else {
                    res.redirect('/auth/login')
                }
            })
        }
    })
})

router.get('/logout', function(req, res) {
    req.session = null;
    res.clearCookie('loggedin');
    res.redirect('/auth/login');
})


module.exports = router