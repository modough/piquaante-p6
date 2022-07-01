const express = require('express');
//express.Router() créer des routeurs séparés pour chaque route principale
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const errorHandler = require('../middleware/errorHandler');

// -------- 
// list de tous les articles rajoutés  
router.get('/', auth, saucesCtrl.findSauces);

// ---------
// voir le detail d'un article
router.get('/:id', auth, errorHandler.id, saucesCtrl.findOneSauce);

//---------------------
// methode creation d'article
router.post('/', auth, multer, errorHandler.sauce, saucesCtrl.createSauce );

//--------------------------
//supprimer un article
router.delete('/:id', auth, errorHandler.id, saucesCtrl.deleteSauce);

//-----------------
// modifier un article
router.put('/:id', auth, multer, errorHandler.id, saucesCtrl.updateOneSauce);

// ---------
// notation d'un article
router.post('/:id/like', auth, errorHandler.id, saucesCtrl.likeOneSauce);



module.exports = router;