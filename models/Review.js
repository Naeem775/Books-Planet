const mongoose = require('mongoose');

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

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select:'name'
    });

    next()
});

module.exports = mongoose.model('Review',reviewSchema);