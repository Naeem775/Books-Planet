const express = require('express');
const {protect, restrictTo} = require('../controllers/authController');
const {getAllReviews,createReview,setBookUserIds,updateReview,deleteReview} = require('../controllers/reviewController');

const router = express.Router({mergeParams:true});

router.use(protect);

router.route('/')
      .get(getAllReviews)
      .post(setBookUserIds ,createReview);

router.route('/:id')
      .patch(updateReview)
      .delete(deleteReview);


module.exports = router;