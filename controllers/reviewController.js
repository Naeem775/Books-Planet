const Review = require('../models/Review');
const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeatures');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);