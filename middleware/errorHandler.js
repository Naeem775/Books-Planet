const APIError = require('../utils/APIError');

// Handling JSON web token error for invalid signature
const JsonWebTokenError = err => new APIError('Invalid token,Please log in again',401);

// Handling Expired Token Error
const TokenExpiredError = err => new APIError('Your token has expired,Please log in again', 401);

// Handling Duplicate Field Errors
const duplicateFieldError = err => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `duplicate filed value: ${value} Please use another value`;
    return new APIError(message,400);
}

//Handling CastError
const castError = err => {
        const message = `Invalid ${err.path} : ${err.value} `;
        return new APIError(message,400);
}

// Handling Validation Errors
const ValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new APIError(message, 400);
  };


const sendDevError = (err,res) => {
    res.status(err.statusCode).json({
        status:err.status,
        name:err.name,
        message:err.message,
        error:err,
        stack:err.stack
    });
}

const sendProdError = (err,res) => {
    // operational errors are trusted,known errors.Send user message
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });

    // not trusted and unknown programming errors, don't leak information
    }else{
        // log the error in hosting platform
        console.error(err);
       
        // Send a generic message
        res.status(500).json({
            status:'Server Error',
            message:'Something Went wrong'
        })
    }
}

const errorHandler = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Server Error'
    
    if(process.env.NODE_ENV === 'development'){
        sendDevError(err,res)
    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err }
        error.message = err.message;
        error.name = err.name;
        // Checking Errors
        if(error.name === 'CastError') error = castError (error);
        if(error.code === 11000) error = duplicateFieldError(error);
        if (error.name === 'ValidationError') error = ValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = JsonWebTokenError(error);
        if(error.name === 'TokenExpiredError') error = TokenExpiredError(error);
        
        sendProdError(error,res);
    }
}

module.exports = errorHandler;