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
dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/tododay5').then(()=>{
    console.log("connected successfuly to the database.")
}).catch((err)=>{
    console.error("failed to connect to database , error:",err)
})
app.use(express.json())
app.use('/todos',todosRoutees)
app.use('/users',usersRoutees)
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