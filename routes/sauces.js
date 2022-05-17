const express = require('express');
//express.Router() créer des routeurs séparés pour chaque route principale
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// -------- 
// list de tous les articles rajoutés  
router.get('/', auth, saucesCtrl.findSauces);

// ---------
// voir le detail d'un article
router.get('/:id', auth, saucesCtrl.findOneSauce);

//---------------------
// methode creation d'article
router.post('/', auth, multer, saucesCtrl.createSauce );

//--------------------------
//supprimer un article
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//-----------------
// modifier un article
router.put('/:id', auth, multer, saucesCtrl.updateOneSauce);

// ---------
// notation d'un article
router.post('/:id/like', auth, saucesCtrl.likeOneSauce);



module.exports = router;