const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'A book titles is required'],
        unique:true
    },
    isbn:{
        type:Number,
        required:[true,'A book isbn is required'],
        unique:true
    },
    author:{
        type:String,
        required:[true,'A book author is required']
    },
    published:{
        type:Date,
        required:[true,'Published date is required']
    },
    publisher:{
        type:String,
        required:[true,'A book publisher is required']
    },
    pages:{
        type:Number,
        required:[true,'Total number of pages are required']
    },
    description:{
        type:String,
        required:[true,'A book description is required']
    },
    website:String
});

module.exports = mongoose.model('Book',bookSchema);