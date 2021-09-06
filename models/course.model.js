const mongoose=require('mongoose')


const courseSchema=mongoose.Schema({
    courseID : {
        type : String,
        required : true
    }, 
    courseName : {
        type : String,
        
    },

    summary : {
        type : String,
        required :true
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