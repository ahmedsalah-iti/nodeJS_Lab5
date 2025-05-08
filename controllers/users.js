const userModel = require('../models/users')
const todosModel = require('../models/todos')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const joi = require('joi');


const getUsers = catchAsync(async (req,res)=>{
    const skip = parseInt(req.query?.skip)
    const limit = parseInt(req.query?.limit)
    
        const users = await userModel.find().skip(skip).limit(limit).select('-__v -password');
        res.status(200).json({
            status:"success",
            message:"all data are received",
            data:users
        });
    

});

const getUser = catchAsync(async (req,res)=>{
    const {id} = req.params;
   
        const user = await userModel.findOne({_id:id});
        res.status(200).json({
            status:"success",
            message:"data received successfuly.",
            data:user
        });
});

const saveUser =  catchAsync(async (req,res)=>{
    const newUser = req.body;
        const user = await userModel.create(newUser);
        res.status(201).json({
            status:"success",
            message:"user added successfuly",
            data:user
        })
   

});

const deleteUser = catchAsync(async (req,res)=>{
    const {id} = req.params;

        const user = await userModel.deleteOne({_id:id});
        res.status(204).json({
            status:"success",
            message:"user deleted successfuly"
        });
});

const updateUser = catchAsync(async (req,res)=>{
    const {id} = req.params;
    let firstName = req.body?.first_name || "";
    let lastName = req.body?.last_name || "";
    let username = req.body?.username || "";
    let email = req.body?.email || "";
    let password = req.body?.password || "";
    if (!username && !firstName && !lastName && !email && !password){
        req.status(400).json({
            status:"failed",
            message:"empty body"
        });
    }
        if(firstName){
            await userModel.updateOne({_id:id},{first_name:firstName});
        }
        if(lastName){
            await userModel.updateOne({_id:id},{last_name:lastName});
        }
        if(username){
            await userModel.updateOne({_id:id},{username});
        }
        if(email){
            await userModel.updateOne({_id:id},{email});
        }
        if(password){
            await userModel.updateOne({_id:id},{password});
        }
        res.status(202).json({
            status:"success",
            message:"updated successfuly"
        });
});

const getTodosByUser = catchAsync(async (req,res) =>{
    const {id} = req.params;
   
        const todos = await todosModel.find({user_id:id})
        res.status(200).json({
            status:"success",
            message:"todos data received successfuly",
            data:todos
        });

});

const loginWithEmail = catchAsync(async(req,res) =>{
    const {email,password} = req.body;
    if (!email || !password){
        next(new AppError(422,"missing email/password"))
    }
        let user = await userModel.findOne({email});
        if (!user){
            next(new AppError(401,"invalid email/pass"))
        }

        let isValid = await bcrypt.compare(password,user.password);
        if (!isValid){
            next(new AppError(401,"invalid email/pass"))
        }

        //GEN TOKEN & SEND IT.
        let token = jwt.sign({
            id:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET,
        {expiresIn:'1h'});
        return res.status(200).json({
            status:"success",
            message:"logged-in successfuly",
            token
        });

})
module.exports = {getUsers,getUser,saveUser,deleteUser,updateUser,getTodosByUser,loginWithEmail}
