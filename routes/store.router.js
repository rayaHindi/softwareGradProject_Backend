const router = require('express').Router();
const StoreController = require('../controllers/store.controller');
const ProductController = require('../controllers/product.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/registration', StoreController.register);

// Route to get products by store ID
router.get('/getAllProducts', authenticateToken, ProductController.getProductsByStoreIdForOwner);
router.get('/getProductsByStoreId/:storeId', ProductController.getProductsByStoreIdForUsers);

// Route to get store details
router.get('/details', authenticateToken, StoreController.getStoreDetails);

// Route to get delivery cities
router.get('/getDelivery-cities', authenticateToken, StoreController.getDeliveryCities);
router.get('/getDelivery-citiesByID/:storeId', StoreController.getDeliveryCitiesByStoreId);


// Route to update delivery cities
router.post('/UpdateDelivery-cities', authenticateToken, StoreController.updateDeliveryCities);



router.get('/fetchProfileInfo/:storeID', StoreController.fetchProfileInfo);

router.get('/getAllStores', StoreController.getAllStores);
router.get('/checkIfAllowSpecialOrders/:storeId', authenticateToken, StoreController.checkIfAllowSpecialOrders);
router.get('/getStoreCategory/:storeId',authenticateToken, StoreController.getStoreCategory);


router.post('/rateStore', authenticateToken, StoreController.rateStore);
router.post("/chooseSubscription", authenticateToken, StoreController.chooseSubscription);
router.get('/getSubscriptionDetails', authenticateToken, StoreController.getSubscriptionDetails);
router.post('/renew-subscription', authenticateToken, StoreController.renewSubscription);

router.get('/getIfSpecialOrdersAllowed', authenticateToken, StoreController.getIfSpecialOrdersAllowed);
router.patch('/updateIfAllowSpecialOrder', authenticateToken, StoreController.updateIfAllowSpecialOrder);

// Route to update shekel per point
router.get('/getShekelPerPoint', authenticateToken, StoreController.getShekelPerPoint);
router.patch('/updateShekelPerPoint', authenticateToken, StoreController.updateShekelPerPoint);

module.exports = router;