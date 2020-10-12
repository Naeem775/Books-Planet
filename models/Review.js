const mongoose = require('mongoose');
const Book = require('./Book');

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'review cannot be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    book:{
        type:mongoose.Schema.ObjectId,
        ref:'Book',
        required:[true,'Review must belongs to a tour']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to a user']
    }
},
{
    toJSON:{ virtuals:true},
    toObject:{ virtuals:true}
}
);

reviewSchema.index({book: 1, user: 1}, {unique:true});

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select:'name'
    });

    next()
});

// calculate average rating and quantity of a book
reviewSchema.statics.calcAverageRatings = async function(bookId){
    const stats = await this.aggregate([
        {
            $match: {book: bookId}
        },
        {
            $group: {
                _id: '$book',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    // console.log(stats);
    if(stats.length > 0){
        
        await Book.findByIdAndUpdate(bookId,{
            averageRating:stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        });
    }else{
        await Book.findByIdAndUpdate(bookId,{
            averageRating:4,
            ratingsQuantity: 0
        });
    }
}

// Calling for stats
reviewSchema.post('save', function(){
    // this points to current review
    this.constructor.calcAverageRatings(this.book);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    // console.log(this.r)
    next();
});

reviewSchema.post(/^findOneAnd/,async function(){
   await this.r.constructor.calcAverageRatings(this.r.book);
});

module.exports = mongoose.model('Review',reviewSchema);