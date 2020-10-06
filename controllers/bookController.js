const Book = require('../models/Book');
const catchAsync = require('../utils/catchAsync');

exports.getAllBooks =catchAsync( async (req,res,next) => {
    const books = await Book.find();

    res.status(200).json({
        status:'Success',
        data:{
            books
        }
    });
});