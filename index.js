const express=require('express')
const cors=require('cors')
const path=require('path')

require('./config/database')

var app=express()

const adminRouter = require('./microservices/admin.service')
app.use('/admin', adminRouter)

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.set('view engine' , 'jade')



app.use('/user/' , require('./controllers/user.controller'))
app.use('/onboarding/' , require('./controllers/onboarding.controller'))
app.use('/course/',require('./controllers/course.controller'))
app.listen(8080,()=> {
    console.log('Server started')
})
