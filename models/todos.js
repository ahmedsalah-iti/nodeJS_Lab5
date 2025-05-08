const mongoose=require('mongoose');
const todosScheme=mongoose.Schema({
    title:{
        type:String,
        unique:[true,"title should be unique."],
        required:[true,"title is required"],
        minLength: [3,'minimum is 3 letters.'],
        maxLength: [255,'max letters is 255 letters.'],
        trim:true
    },
    status:{
        type:String,
        required:[true,"status  is required."],
        enum:['new','pending','done'],
        default:'new'
    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required:[true,"missing user_id"]
    }
   
    

}, {timestamps:true});
module.exports=mongoose.model('todo',todosScheme)
