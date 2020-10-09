const express = require('express');
const router = express.Router();
const {getAllBooks} = require('../controllers/bookController');
const {protect,restrictTo} = require('../controllers/authController');

router.route('/').get(protect,getAllBooks);

module.exports = router;