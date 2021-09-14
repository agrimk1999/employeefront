const { profile } = require('console')
const mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
//years of service to be calculated from DOJ
//age to be calculated from DOB
//add default profile image for the user profile photo
//amountCompleted is calculated on the basis of weeks completed
    courseID : [{
        id : {
            type : String,
            trim : true,
            uppercase : true,
            unique: true
        },
        amountCompleted : {
            type : Number,
            default : 0
        }
    }],
    role : {
        type : Number,
        default : 0
    },
    empId : {
        type : String,
        unique : true,
        trim : true,
        uppercase: true
    },
    firstName:{
            type : String,
            required : true,
            trim: true
        },
        lastName : {
            type : String,
            required : true,
            trim : true
        },
        dob : {
            type : Date
        },
        email  :{
            type : String,
            required : true,
            trim : true
        },
        address : {
            type : String,
            trim : true
        },
        designation : {
            type : String,
            required : true,
            uppercase : true,
            trim : true
        },
        profilePhoto:{
           type : String
        },
        doj : {
            type : Date
        } 
})


module.exports=mongoose.model('users', UserSchema)