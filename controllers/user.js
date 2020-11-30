const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const CryptoJS = require('crypto-js');

exports.signup = (req, res, next) => {
    RegExpPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
    if (RegExpPassword.test(req.body.password) == false)
        return res.status(400).json({ messsage: 'This password isn\'t complex enough.' });
    RegExpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (RegExpEmail.test(req.body.email) == false)
        return res.status(400).json({ messsage: 'This Email adress isn\'t correct.' });
    var encryptedEmail = JSON.stringify(CryptoJS.SHA256('RANDOM_SECRET_NONCE' + req.body.email));
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
                const user = new User({
                    userId: req.body.userId,
                    email: encryptedEmail,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ messsage: 'User created.' }))
                    .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    var encryptedEmail = JSON.stringify(CryptoJS.SHA256('RANDOM_SECRET_NONCE' + req.body.email));
    User.findOne({ email: encryptedEmail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found.' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password.' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};