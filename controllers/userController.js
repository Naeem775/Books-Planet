const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}

exports.updateMe = catchAsync( async (req,res,next) => {
    // 1) Check if user tried to update password
    if(req.body.password || req.body.passwordConfirm){
        return next(new APIError('This route is not for update password,Please use /updatePassword to update password. ',400))
    }

    // 2) Filter unwanted fields
    const filteredBody = filterObj(req.body, 'name','email');

    // 3) Update The User
    const updatedUser = await User.findOneAndUpdate(req.user.id, filteredBody,{
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status:'Success',
        data:{
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync( async (req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active:false});

    res.status(204).json({
        status:'Success',
        data: null
    });
});

exports.getAllUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();

    res.status(200).json({
        Users: users.length,
        status:'Success',
        data:{
            users
        }
    });
});