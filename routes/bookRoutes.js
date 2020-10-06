const express = require('express');
const router = express.Router();
const {getAllBooks} = require('../controllers/bookController');
const {protect,restrictTo} = require('../controllers/authController');

router.route('/').get(protect,restrictTo('admin'),getAllBooks);

module.exports = router;