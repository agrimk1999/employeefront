const mongoose=require('mongoose')

const onboardSchema=mongoose.Schema({
    
    empId : {
        type : String,
        unique: true,
        trim: true
    },
    designation_id : {
        type : String,
        required : true,
        trim : true,
        uppercase : true
    },

    designation : {
        type : String,
        required : true,
        uppercase : true,
        trim : true
    },

    steps : [{
       id : {
           type : String,
           trim : true,
           uppercase : true
       },
       isCompleted : {
           type: Boolean,
           default : false
       }
    }]


})


module.exports=mongoose.model('onboards' , onboardSchema)