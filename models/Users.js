const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
        username:{
            type: String,
            require:true,
            unique: true
        },
        password:{
            type: String,
            require: true
        },
        name:{
            type:String,
            require:true
        },
        yob:{
            type:String,
            require:true
        },
        isAdmin:{
            type:Boolean,
            default: false,
            require:true
        }
    },
    {
        timestamps: true
    });
var Users = mongoose.model('Users', userSchema);
module.exports = Users;