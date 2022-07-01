const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-validation-error-message-handler');


//----------------------
//Schema de données objet Sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String]},
    usersDisliked: { type: [String]},
});

const model = mongoose.model('Sauce', sauceSchema);

const object = new model({});
object.save(function (err, doc) {
  if (err) {
    const error = mongooseErrorHandler(err);
}
});

module.exports = model;
