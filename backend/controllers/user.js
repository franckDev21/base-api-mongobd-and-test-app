const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (rep,res,next) => {
  bcrypt.hash(rep.body.password,10)
    .then(hash => {
      const user = new User({
        email : rep.body.email,
        password : hash
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur enregistré !' }))
        .catch(err => res.status(400).json({ err }));
  })
  .catch(err => res.status(500).json({ err }));
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id }, // data encrypt
                  'RANDOM_TOKEN_SECRET_KEY', // secret key
                  { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};