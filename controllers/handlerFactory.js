const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeatures');

// Get All Documents
exports.getAll = Model => catchAsync( async (req,res,next) => {
    // To allow for nested GET reviews on Books
    let filter = {};
     if(req.params.bookId) filter = {book: req.params.bookId};
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        // const doc = await features.query.explain();
        const doc = await features.query;
    res.status(200).json({
        results: doc.length,
        status:'Success',
        data:{
            doc
        }
    });
});

// Get single Document
exports.getOne = (Model,popOptions) => catchAsync(async (req,res,next) => {
    let query = Model.findById(req.params.id);
    // console.log(popOptions)
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;
    if(!doc){
        return next(new APIError('No document found with this ID:',404));
        } 

    res.status(200).json({
        status:'Success',
        data:{
            doc
        }
    });
});

// Create Documents
exports.createOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status:'Success',
        data:{
            doc
        }
    });
});

// Update Documents
exports.updateOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    if(!doc){
        return next(new APIError('no Document found with this id', 404));
    }
    res.status(200).json({
        status:'Success',
        data:{
            doc
        }
    });

});

// Delete Documents
exports.deleteOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc){
        return next(new APIError('no document found with this id', 404));
    }

    res.status(204).json({
        status:'Success',
        data:null
    });
});
