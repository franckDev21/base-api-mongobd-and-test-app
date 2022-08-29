const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const stoffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

//  connection to mongodb
mongoose.connect('mongodb+srv://franck:monJesus@cluster0.iae93hj.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// init my express app
const app = express();

// middleware to get the body of the request 
app.use(express.json());

// cors authorization 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// routes
app.use('/api/stuff',stoffRoutes);
app.use('/api/auth',userRoutes);
app.use('/images',express.static(path.join(__dirname,'images')));


module.exports = app;