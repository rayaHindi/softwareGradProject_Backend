const router = require('express').Router();
const StoreController = require('../controllers/store.controller');

router.post('/registration', StoreController.register);

module.exports = router;