const Thing = require('../models/Thing');
const fs = require('fs');

exports.getAllThing = (req, res, next) => {
  Thing.find()
    .then(things => res.status(201).json(things))
    .catch((err) => res.status(400).json({ err }))
}

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Thing({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  thing.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({_id: req.params.id})
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        return res.status(401).json({ message : 'Not authorized'});
      }
      Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
        .then(() => res.status(200).json({message : 'Objet modifié!'}))
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({_id: req.params.id})
    .then(thing => {
      if (thing.userId != req.auth.userId) { // we check if this is the real user
        return res.status(401).json({ message : 'Not authorized'});
      }

      const filename = thing.imageUrl.split('/images/')[1]; // we get the name of the file
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({_id: req.params.id}) // we delete the file on the server and the object in the database
          .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
          .catch(error => res.status(401).json({ error }));
      });

    })
    .catch(error => res.status(500).json({ error }))
}