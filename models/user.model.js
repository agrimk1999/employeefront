const { profile } = require('console')
const mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
//years of service to be calculated from DOJ
//age to be calculated from DOB
//add default profile image for the user profile photo
//amountCompleted is calculated on the basis of weeks completed
    courseID : [{
        id : {
            type : String
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
        type : String
    },
    firstName:{
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        dob : {
            type : Date
        },
        email  :{
            type : String,
            required : true
        },
        googleId: {
            type : String
        },
        address : {
            type : String,
            required : true
        },
        designation : {
            type : String,
            required : true
        },
        profilePhoto:{
           type : String
        },
        doj : {
            type : Date
        } 
})


module.exports=mongoose.model('users', UserSchema)