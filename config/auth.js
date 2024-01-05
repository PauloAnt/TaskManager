const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require("../models/User");
const User = mongoose.model("users");

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) => {
        User.findOne({email: email}).then((user) => {
            if (!user){
                return done(null, false, {message: "Essa conta não existe!"});
            }
            bcrypt.compare(senha, user.password, (erro, batem) => {
                if (batem){
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Senha incorreta"});
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            })
    })
}
