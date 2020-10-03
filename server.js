const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const APIError = require('./utils/APIError');

dotenv.config({path:'./config/config.env'});
const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Mounting Routes
app.use('/api/v1/user', userRouter);

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
    useFindAndModify: true,
    useUnifiedTopology: true
    }
).then(() => console.log('Database is connected Successfully'))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on Port: ${PORT} in ${process.env.NODE_ENV} mode`));