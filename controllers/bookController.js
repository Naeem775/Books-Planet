
const Book = require('../models/Book');
const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeatures');
const factory = require('./handlerFactory');

// Get All Books
exports.getAllBooks = factory.getAll(Book);

// Get Single Book
exports.getBook = factory.getOne(Book, {path: 'reviews'});

// Add/Create book
exports.addBook = factory.createOne(Book);

// Update Book
exports.updateBook = factory.updateOne(Book);

// Delete Book
exports.deleteBook = factory.deleteOne(Book);
