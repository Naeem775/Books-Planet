const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config/config.env'});

const Book = require('./models/Book');
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

// Read JSON data
const books = JSON.parse(fs.readFileSync(`${__dirname}/data/books.json`,'utf-8'));

// Import to Database
const importData = async () => {
    try {
        await Book.create(books);
        console.log('Data is imported Successfully...');
        process.exit()
    } catch (err) {
        console.log(err);
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Book.deleteMany();
        console.log('Data is deleted...');
        process.exit()
    } catch (error) {
        
    }
}

// Using command line to import data
if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}