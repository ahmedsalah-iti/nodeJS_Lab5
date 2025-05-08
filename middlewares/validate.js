const AppError = require("../utils/AppError");

let validateReqBody = (schema)=>{
    return (req,res,next)=>{
        let validation = schema.validate(req.body,{abortearly:false});
        if(validation.error){
            next(new AppError(400,validation.error))
        }else{
            next();
        }
    }
}
module.exports = validateReqBody;