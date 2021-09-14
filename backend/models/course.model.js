const mongoose=require('mongoose')


const courseSchema=mongoose.Schema({
    courseID : {
        type : String,
        required : true
    }, 
    courseName : {
        type : String,
        required: true,
        trim : true,
        uppercase : true
        
    },

    summary : {
        type : String,
    },

    courseImage : {
        type : String
    },
    weightage : {
        type : Number,
        required : true
    }
})


module.exports = mongoose.model('courses' , courseSchema)