const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/APIError');
const bcrypt = require('bcryptjs');

// Sign JWT
const signJWT = id => {
    return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

// Signing Up User
exports.signup =catchAsync( async (req,res,next) => {
    const {name,email,password,passwordConfirm} = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm
    });

    const token = signJWT(newUser._id);
        
    res.status(201).json({
            status:'Success',
            token,
            data: {
                user:newUser
            }
        });

});

// Log In User
exports.login =catchAsync( async (req,res,next) => {
    const {email,password} = req.body
    console.log(req.body)

    // 1) Check if email and password exist
    if(!email || !password){
        return next(new APIError('Please provide valid email and password',400));
    }
    
    // 2) Check if user exist and password is correct
    const user = await User.findOne({email});
    if(!user || ! await bcrypt.compare(password,user.password)){
        return next(new APIError('Email or Password is not correct',401));
    }

    // 3) If everything ok,send the token
    const token = signJWT(user._id)
    res.status(200).json({
        status:"Success",
        token
    });
})