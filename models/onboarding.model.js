const mongoose=require('mongoose')

const onboardSchema=mongoose.Schema({
    
    empId : {
        type : String
    },
    designation_id : {
        type : String,
        required : true
    },

    designation : {
        type : String,
        required : true
    },

    steps : [{
       id : {
           type : String
       },
       isCompleted : {
           type: Boolean,
           default : false
       }
    }]


})


module.exports=mongoose.model('onboards' , onboardSchema)