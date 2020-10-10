const express = require('express');
const router = express.Router();
const {getAllBooks,getBook,addBook,updateBook, deleteBook} = require('../controllers/bookController');
const {protect,restrictTo} = require('../controllers/authController');

router.route('/')
      .get(getAllBooks)
      .post(protect,restrictTo('admin', 'moderator'),addBook);

router.route('/:bookId')
      .get(getBook)
      .patch(protect,restrictTo('admin','moderator'),updateBook)
      .delete(protect,restrictTo('admin'), deleteBook);

module.exports = router;