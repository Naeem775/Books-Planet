const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const APIError = require('../utils/APIError');
const bcrypt = require('bcryptjs');

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user,statusCode,res) => {
    const token = signToken(user.id);
    
    const cookieOptions = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true 
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status:'Success',
        token,
        data: {
            user
        }
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
        
    createSendToken(newUser,201,res)

});

// Log In User
exports.login =catchAsync( async (req,res,next) => {
    const {email,password} = req.body
    // console.log(req.body)

    // 1) Check if email and password exist
    if(!email || !password){
        return next(new APIError('Please provide valid email and password',400));
    }
    
    // 2) Check if user exist and password is correct
    const user = await User.findOne({email}).select('+password');
    // console.log(user)
    if(!user || ! await bcrypt.compare(password,user.password)){
        return next(new APIError('Email or Password is not correct',401));
    }

    // 3) If everything ok,send the token
    createSendToken(user,200,res);
});

// Protect Middleware
exports.protect = catchAsync( async (req,res,next) => {
    let token;
    //1) Getting token and check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // console.log(req.headers)
        token = req.headers.authorization.split(' ')[1];
        // console.log(token);
    }

    if(!token){
        return next(new APIError('You are not logged in.Please log in to get access',401));
    }

    // 2) Verification of Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);


    // 3) Check if user is still there
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new APIError('The user belongs to this token do not exist anymore',401));
    }

    //4) Check if user changed password after issuing token
    req.user = currentUser;
    next();
});

// Authorization by roles
exports.restrictTo =  (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new APIError('You do not have permission to perform this action',403));
        }
        next()
    }
}

// exports.forgotPassword = catchAsync( async (req,res,next) => {
//     //1) Get User bases on posted email
//     const user = await User.findOne({email: req.body.email});
//     if(!user){
//         return next(new APIError('no user found with this email id',404));
//     }

//     // 2) Generate Random Token
//     const resetToken = user.passwordResetToken();
//     await user.save({validateBeforeSave:false});

//     // 3) Send it to user's email
// })

exports.updatePassword = catchAsync( async (req,res,next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if posted password is correct
    console.log(req.body);
    const correct = await bcrypt.compare(req.body.currentPassword,user.password);
    if(!correct){
        return next(new APIError('Password is not correct,Please Try again', 403));
    }

    // 3) Update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();

    // 4) Send the jwt token
    createSendToken(user,200,res);
    
})