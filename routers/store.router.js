const router = require('express').Router();
const StoreController = require('../controller/store.controller');

router.post('/registration', StoreController.register);

module.exports = router;