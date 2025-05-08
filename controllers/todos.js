const todoModel = require('../models/todos');
const validator = require('validator');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const getMany = catchAsync(async(req,res,next)=>{
    const skip = parseInt(req.query?.skip)
    const limit = parseInt(req.query?.limit)
        const todos = await todoModel.find().skip(skip).limit(limit).select('-__v').populate('user_id',['-_id','-password','-__v']);
        res.status(200).json({
            status:"success",
            message:"all data displayed successfuly.",
            data:todos
        });
})
const getOne = catchAsync(async(req,res,next)=>{
    let {id} = req.params;

        const todo = await todoModel.findOne({_id:id}).populate('user_id',['-_id','-__v','-password']);
        if(todo){

            res.status(200).json({
                status:"success",
                message:"data received successfuly",
                data: todo
            });
        }else{
            next(new AppError(404,"todo not found"))
        }
})
const insertOne = catchAsync(async (req,res,next)=>{
    let newTitle = req.body?.title || "";
    if (!validator.isLength(newTitle || '',{min:3,max:255})){
        next(new AppError(400,"sorry , title is required with min 3 letters and max 255 letters."))
    }
        req.body.user_id = req.user_id
        let insertOne = await todoModel.create(req.body);
        res.status(200).json({
            status:"succcess",
            message:"saved successfuly",
            data:insertOne
        });

})
const deleteOne = catchAsync(async (req,res,next) =>{
    let {id} = req.params;
   
        const todo = await todoModel.deleteOne({_id:id})
        res.status(204).json({
            status:"succcess",
            message:"deleted successfuly",
            data:todo
        });

})
const updateOne = catchAsync(async (req,res,next)=>{
    let {id} = req.params;
    let status = req.body?.status || "";
    let title = req.body?.title || "";
    if (!title && !status){
        next(new AppError(400,"missing title or/and status"))
    }
        const todo = await todoModel.findOne({_id:id});
        if(todo){
            if (status){
                await todoModel.updateOne({_id:id},{status});
            }
            if (title){
                await todoModel.updateOne({_id:id},{title});
            }
        }
        res.status(202).json({
            status:"succcess",
            message:"updated successfuly"
        });
    
})

module.exports = {getMany,getOne,insertOne,deleteOne,updateOne}