const Sauce = require('../models/sauceModel');
const fs = require('fs');

// CREATE
exports.createSauce = (req, res, next) => {
    const dataObject = JSON.parse(req.body.sauce);
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
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    data.save()
        .then(() => res.status(201).json({ message: 'Objet registered.' }))
        .catch(error => res.status(400).json({ error }));
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

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like == 1) {
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId);
            }
            else if (req.body.like == -1) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(req.body.userId);
            }
            else {
                if ((index = sauce.usersLiked.indexOf(req.body.userId)) != -1) {
                    sauce.likes -= 1;
                    sauce.usersLiked.splice(index);
                }
                if ((index = sauce.usersDisliked.indexOf(req.body.userId)) != -1) {
                    sauce.dislikes -= 1;
                    sauce.usersDisliked.splice(index);
                }
            }
            sauce.save()
                .then(() => res.status(200).json({ message: 'Object Graded.' }))
                .catch(error => res.status(404).json({ error }));
            })
        .catch(error => res.status(400).json({ error }));
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
