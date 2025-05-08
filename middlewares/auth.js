const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError')
exports.auth =(req,res,next)=>{
//    const {authorization} = req.headers;
   const authorization = req.headers?.authorization || "";
   if (!authorization){
    next(new AppError(401,"you are Unauthorized"))
   }
   try{

       const decoded = jwt.verify(authorization,process.env.JWT_SECRET);
    //    console.log("decoded ? : ",decoded);
    req.user_id = decoded.id;
    req.role = decoded.role;
       next();
    }catch(err){
        next(new AppError(401,"you are Unauthorized"))
    }
}

exports.restrictTo =  (...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.role)){
            next(new AppError(403,"You dont have permission to view this content"))
        }else{
            next();
        }
    }
}