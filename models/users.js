const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const usersSchema = mongoose.Schema({
    first_name:{
        type:String,
        minLength: 3,
        maxLength:50,
        required:true,
        trim:true
    },
    last_name:{
        type:String,
        minLength: 3,
        maxLength:50,
        required:true,
        trim:true
    },
    username:{
        type:String,
        minLength: 3,
        maxLength: 10,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:function(v){return /^[a-zA-Z0-9]{1,50}(@)(gmail|yahoo)(.com)$/.test(v)},
            message:()=>"email is not valid, only valid gmail/yahoo emails are supported."
        }
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
},{timestamps:true});

usersSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
    // console.log("this:",this);
    next();
})

module.exports = mongoose.model('user',usersSchema)