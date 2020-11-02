const Sauce = require('../models/sauce');
const fs = require('fs');

// CREATE
exports.createSauce = (req, res, next) => {
    const dataObject = JSON.parse(req.body.sauce);
    console.log(dataObject);
    delete dataObject._id;
    const data = new Sauce({
        userId: dataObject.userId,
        name: dataObject.name,
        manufacturer: dataObject.manufacturer,
        description: dataObject.description,
        mainPepper: dataObject.mainPepper,
        heat: dataObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        userDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    data.save()
        .then(() => res.status(201).json({ message: 'Objet registered.' }))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    console.log(req.body);
    next();
};

// READ
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// UPDATE
exports.updateSauce = (req, res, next) => {
    const dataObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...dataObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Object updated.' }))
        .catch(error => res.status(404).json({ error }));
};

// DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Object deleted.' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
