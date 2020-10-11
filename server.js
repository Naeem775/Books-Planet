const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Routes and middleware
const userRouter = require('./routes/userRoutes');
const bookRouter = require('./routes/bookRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/errorHandler');
const APIError = require('./utils/APIError');

dotenv.config({path:'./config/config.env'});
const app = express();

// Global Middlewares

// Set security HTTP Headers
app.use(helmet());

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP,please try late in an hour'
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended:true}));

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data Sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Mounting Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error for undefined routes
app.all('*', (req,res,next) => {
    next(new APIError(`can't find this route ${req.originalUrl} on this server`,400));
})

app.use(errorHandler);

// Connecting to Database
const DB = process.env.MONGO_URI

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    }
).then(() => console.log('Database is connected Successfully'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on Port: ${PORT} in ${process.env.NODE_ENV} mode`));