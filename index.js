const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
const todosRoutees = require('./routes/todos')
const usersRoutees = require('./routes/users')
const dotenv = require('dotenv');
const AppError = require('./utils/AppError')
const catchAsync = require('./utils/catchAsync')
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // console.log("\n================\n",file,"\n================\n")
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage ,
    fileFilter: function(req,file,cb){
        // console.log("\n================\n",file,"\n================\n")
        /*
        ================
 {
  fieldname: 'avatar',
  originalname: '8532b623f7aeaba917d1ae9cbd670b20.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg'
}
================
        */
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
}else{
    cb(new AppError(403,'Only JPG, JPEG, GIF, and PNG files are allowed'), false);
}
    }
 })



dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/tododay5').then(()=>{
    console.log("connected successfuly to the database.")
}).catch((err)=>{
    console.error("failed to connect to database , error:",err)
})
app.use(express.json())
app.use('/todos',todosRoutees)
app.use('/users',usersRoutees)
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.status(201).json({status:"success"})
  })
app.use((req,res,next)=>{
next(new AppError(404,"page not found."))
});
//error handling middleware.
app.use((err,req,res,next)=>{
    res.status(err.statusCode || 501).json({
        status:"failed",
        message:err.message || "something went wrong."
    });
});
app.listen(port , ()=>{
    console.log("Server Started Successfuly on port:",port);
    console.log("URL: \t\t\t\t\t\t\t\t\t\t",`http://127.0.0.1:${port}`);
});