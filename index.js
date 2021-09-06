const express=require('express')
const cors=require('cors')
const path=require('path')

require('./config/database')
require('dotenv').config()

var app=express()

// const adminRouter = require('./microservices/adminbro.service')
// app.use('/admin', adminRouter)

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.set('view engine' , 'jade')



app.use('/user/' , require('./controllers/user.controller'))
app.use('/onboarding/' , require('./controllers/onboarding.controller'))
app.use('/course/',require('./controllers/course.controller'))
app.listen(process.env.PORT || 8080,()=> {
    console.log(`Server started on port ${process.env.PORT}`)
})
