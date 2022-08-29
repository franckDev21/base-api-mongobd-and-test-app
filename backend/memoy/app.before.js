const express = require('express');
const mongoose = require('mongoose');

// model
const Thing = require('../models/Thing');

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

// my routes
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(err => res.status(400).json({ err }));
});

app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id },{...req.body, _id: req.body.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(201).json(things))
    .catch((err) => res.status(400).json({ err }))
});

app.get('/api/stuff/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;