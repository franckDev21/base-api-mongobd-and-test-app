exports.createThing = (req, res, next) => {
  delete req.body._id;
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(err => res.status(400).json({ err }));
}

exports.modifyThing = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id },{...req.body, _id: req.body.id})
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
}