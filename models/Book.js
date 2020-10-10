const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'A book title is required'],
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
    website:String,
    price:{
        type: Number,
        required:[true, 'A book must have a price']
    },
    categories:{
        type: Array,
        required: [true, 'A book must belong to a category']
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    rating:{
        type: Number,
        default: 4,
        max: 5,
        min: 1
    }
});

module.exports = mongoose.model('Book',bookSchema);