const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide your name']
    },
    email:{
        type:String,
        required:[true,'Please provide an email'],
        unique:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please Confirm Your Password'],
        validate:{
            // Only runs on create or save
            validator:function(el) {
                return el === this.password
            },
            message:'Password do not match,try again'
        }
    },
    photo:String,
    createdAt:{
        type:Date,
        default: Date.now()
    },
    role:{
        type: String,
        enum:['user','moderator','admin'],
        required:[true,'A user must have a role'],
        default: 'user'
    }
});

userSchema.pre('save', async function(next) {
    // run only if user update or create new password
    if(!this.isModified('password')) return next();

    // bcrypt password
    this.password = await bcrypt.hash(this.password,12);

    // do not store confirm password in database
    this.passwordConfirm = undefined

    next()
});

module.exports = mongoose.model('User', userSchema);