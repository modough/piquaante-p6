const express = require('express');

const app = express();

const mongoose = require('mongoose');

const stuffRoutes = require('./routes/sauces');

const userRoutes = require('./routes/user');

const path = require('path');

require('dotenv').config()

const bodyParser = require('body-parser');


//---------------
// Mongoose database
mongoose.connect(process.env.MONGODB_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//-------------
//ex: body-parser permet d'acceder au corps de la requete
app.use(bodyParser.json());


//----------------
//Override CORS restriction
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
//----------------
// middleware pour les ressources d'images static
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;