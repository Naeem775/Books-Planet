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

// Get Single Book
exports.getBook = catchAsync(async (req,res,next) => {
    const book = await Book.findById(req.params.bookId);
    if(!book){
        return next(new APIError(`No book found with this ID: ${id}`,404));
        } 

    res.status(200).json({
        status:'Success',
        data:{
            book
        }
    });
});

// Add/Create book
exports.addBook = catchAsync(async (req,res,next) => {
    const newBook = await Book.create(req.body);
    res.status(201).json({
        status:'Success',
        data:{
            newBook
        }
    });
});


// Update Book
exports.updateBook = catchAsync(async (req,res,next) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId,req.body,{
        new:true,
        runValidators:true
    });
    if(!updatedBook){
        return next(new APIError(`no book found with this id: ${req.params.bookId}`, 404));
    }

    res.status(200).json({
        status:'Success',
        data:{
            updatedBook
        }
    });

});

// Delete Book
exports.deleteBook = catchAsync(async (req,res,next) => {
    const book = await Book.findByIdAndDelete(req.params.bookId);

    if(!book){
        return next(new APIError(`no book found with this id:${req.params.bookId}`, 404));
    }

    res.status(204).json({
        status:'Success',
        data:null
    });
});
