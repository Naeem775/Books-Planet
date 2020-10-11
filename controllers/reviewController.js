const Review = require('../models/Review');
const factory = require('./handlerFactory');

// Get All Reviews
exports.getAllReviews = factory.getAll(Review);

// Middleware for setting book and user id's for creating a new review
exports.setBookUserIds = (req,res,next) => {
    if(!req.body.book)  req.body.book = req.params.bookId;
    if(!req.body.user) req.body.user = req.user.id
    next();
}
// Create Review
exports.createReview = factory.createOne(Review);

// Update Review
exports.updateReview = factory.updateOne(Review);

// Delete Review
exports.deleteReview = factory.deleteOne(Review);