// routes/storeSpecialOrderOptionRouter.js

const express = require('express');
const router = express.Router();
const storeSpecialOrderOptionController = require('../controllers/storeSpecialOrderOption.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/create',authenticateToken, storeSpecialOrderOptionController.createStoreSpecialOrderOption);
router.get('/getStoreOptions/:storeId',authenticateToken, storeSpecialOrderOptionController.getStoreSpecialOrderOptions);
router.get('/getStoreOptions',authenticateToken, storeSpecialOrderOptionController.getStoreSpecialOrderOptions);

router.put('/update/:optionId',authenticateToken, storeSpecialOrderOptionController.updateStoreSpecialOrderOption);
router.delete('/delete/:optionId',authenticateToken, storeSpecialOrderOptionController.deleteStoreSpecialOrderOption);

module.exports = router;
