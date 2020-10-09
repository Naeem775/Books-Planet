const Book = require('../models/Book');
const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeatures');

// Get All Books
exports.getAllBooks =catchAsync( async (req,res,next) => {
    const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const books = await features.query;

    res.status(200).json({
        results: books.length,
        status:'Success',
        data:{
            books
        }
    });
});