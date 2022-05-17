const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const sauce = new Sauce({
        //Operateur spread (...) pour copier tous les elements de thingObject
      ...thingObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, likes: 0, dislikes: 0
    });
    //save() pour enregistrer l'objet crée
    sauce.save()
    .then(() => res.status(201).json({ message: 'Enregistré !'}))
    .catch(error => res.status(400).json({ error }));   
    
};

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
    .then((User) => {
        if (!User) {
            return res.status(404).json({
                error: new Error('Objet non trouvé !')
            });
        }
        if (User.userId !== req.auth.userId) {
            return res.status(401).json({
                error: new Error('Requête non autorisée !')
            });
        }
        const filename = User.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            // deleteOne() supprimer un objet grâce à son id
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });   
    })
    .catch(error => res.status(500).json({ error }));     
};

exports.findOneSauce = (req, res, next) => {
    //findOne() pour retourner un seul objet grâce à son id
    Sauce.findOne({ _id: req.params.id })
    .then(User => res.status(200).json(User))
    .catch(error => res.status(400).json({ error }));
};

exports.findSauces = (req, res, next) => {
    //find() pour retourner tous les objets crées 
    Sauce.find()
    .then(User => res.status(200).json(User))
    .catch(error => res.status(400).json({ error }));
    
};


exports.updateOneSauce = (req, res, next) => {
    const thingObject = req.file ?
    {
        ...JSON.parse(req.body.User),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    //updateOne() Mise à jour de la sauce avec les nouvelles valeurs
    Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modifié !'}))
    .catch(error => res.status(400).json({ error }));
};



exports.likeOneSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    
    Sauce.findOne({ _id: req.params.id })
    .then(User => {
        // nouvelles valeurs à modifier
        const newValues = {
            usersLiked: User.usersLiked,
            usersDisliked: User.usersDisliked,
            likes: 0,
            dislikes: 0
        }
        // Différents cas:
        switch (like) {
            case 1:  // CAS: sauce liked
                newValues.usersLiked.push(userId);
                break;
            case -1:  // CAS: sauce disliked
                newValues.usersDisliked.push(userId);
                break;
            case 0:  // CAS: Annulation du like/dislike
                if (newValues.usersLiked.includes(userId)) {
                    // si on annule le like
                    const index = newValues.usersLiked.indexOf(userId);
                    newValues.usersLiked.splice(index, 1);
                } else {
                    // si on annule le dislike
                    const index = newValues.usersDisliked.indexOf(userId);
                    newValues.usersDisliked.splice(index, 1);
                }
                break;
        };
        // Calcul du nombre de likes / dislikes
        newValues.likes = newValues.usersLiked.length;
        newValues.dislikes = newValues.usersDisliked.length;
        //updateOne() Mise à jour de la sauce avec les nouvelles valeurs
        Sauce.updateOne({ _id: req.params.id }, newValues )
        .then(() => res.status(200).json({ message: 'Sauce notée !' }))
        .catch(error => res.status(400).json({ error }))  
    })
    .catch(error => res.status(500).json({ error }));
}