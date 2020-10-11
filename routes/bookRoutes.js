const express = require('express');
const router = express.Router();
const reviewRouter = require('./reviewRoutes');
const {getAllBooks,getBook,addBook,updateBook, deleteBook} = require('../controllers/bookController');
const {protect,restrictTo} = require('../controllers/authController');

// Nested route to create a review
router.use('/:bookId/reviews',reviewRouter);

router.route('/')
      .get(getAllBooks)
      .post(protect,restrictTo('admin', 'moderator'),addBook);

router.route('/:id')
      .get(getBook)
      .patch(protect,restrictTo('admin','moderator'),updateBook)
      .delete(protect,restrictTo('admin'), deleteBook);

module.exports = router;