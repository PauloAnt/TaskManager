const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('users');
const passport = require('passport');
const { userAuth } = require('../helpers/cargo');

router.get('/login', (req, res) => {
    res.render('main/login');
});
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})
router.get('/register', (req, res) => {
    res.render('main/register');
});

router.post('/register/adduser', async (req, res) => {
    var erros = [];

    if (!req.body.name || typeof req.body.name === undefined || req.body.name === null) {
        erros.push({ texto: 'Nome inválido' });
    }

    if (!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        erros.push({ texto: 'Email inválido' });
    }
    if (!req.body.cargo || typeof req.body.cargo === undefined || req.body.cargo === null || req.body.cargo == "0") {
        erros.push({ texto: 'Cargo inválido' });
    }
    if (!req.body.password || typeof req.body.password === undefined || req.body.password === null) {
        erros.push({ texto: 'Senha inválida' });
    }
    if (erros.length > 0) {
        res.render('main/register', { erros: erros });
    } else {
        const password_crip = await bcrypt.hash(req.body.password, 10);
        const novoUser = {
            name: req.body.name,
            email: req.body.email,
            cargo: req.body.cargo,
            password: password_crip
        };
        new User(novoUser).save().then(() => {
            res.redirect('/users/login');
            req.flash('success_msg', 'Conta criada com sucesso!');
        }).catch((err) => {
            res.redirect('/users/register');
            req.flash('error_msg', 'Ocorreu um erro, tente novamente!');
        });
    }
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
      })
})

module.exports = router;
