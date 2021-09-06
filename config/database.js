const mongoose=require('mongoose')
const path=require('path')

require('dotenv').config({path : path.join(__dirname,'..','.env')})

if(process.env.DBCASE == 'PRODUCTION'){
mongoose.connect('mongodb+srv://admin:admin@employeeonboarding.8cpnr.mongodb.net/telstra?retryWrites=true&w=majority', {
    useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
})
}else{
    mongoose.connect('mongodb+srv://admin:admin@employeeonboarding.8cpnr.mongodb.net/JestDB?retryWrites=true&w=majority', {
    useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
})

}