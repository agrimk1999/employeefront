const app=require('./employee.service')
const mongoose=require('mongoose')
const supertest=require('supertest')
const User=require('../models/user.model')
const onboard=require('../models/onboarding.model')

let user={
    firstName : 'Ayush',
    lastName : 'Sonthalia',
    empId : 'EMP002',
    courseID : [
        {
            id : 'JAVA',
            amountCompleted : 0
        },
        {
            id : 'C++',
            amountCompleted : 0
        },
        {
            id : 'C',
            amountCompleted : 0
        }
    ],
    address : 'Bangalore',
    dob : '04-05-1999',
    designation : 'Software',
    email : 'asonthalia@gmail.com',
    googleId : '1234',
    role : 0
}

let onboardUser={
    empId : "EMP002",
    designation_id : "S",

    designation : "Software",

    steps : [
        {
       id : "submit pan",
       isCompleted : false
    }, {
        id : 'Laptop',
        isCompleted : false
    }]
}


beforeEach((done) => {
    mongoose.connect("mongodb+srv://admin:admin@employeeonboarding.8cpnr.mongodb.net/JestDB?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());

      app.request.user=user
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
    app.request.user=null
  });

  app.request.isAuthenticated = ()=> {
      return true
  }


  test('Get Employee Dashboard' , async ()=> {
      const tempuser=await User.create({...user})
      const tempon=await onboard.create({...onboardUser})
      await supertest(app).get(`/empDashboard/${user.empId}`)
      .expect(200)
      .then((response)=> {
        //   console.log(response.body)
          expect(response.body.emp.courseEmp.firstName).toBe('Ayush')
          expect(response.body.emp.courseEmp.lastName).toBe('Sonthalia')
          expect(response.body.emp.courseEmp.empId).toBe('EMP002')
          expect(response.body.emp.courseEmp.role).toBe(0)
      })
  })

  test('POST Update Employee Course' , async ()=> {
      const tempuser=await User.create({...user})
      
      await supertest(app).post('/empUpdateCourses')
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('updated succesfully')
          const courseEmp=await User.findOne({empId : user.empId})
      expect(courseEmp.courseID[0].amountCompleted).toBe(20)
      expect(courseEmp.courseID[2].amountCompleted).toBe(10)
      })

      

  })


  test('POST Update Employee tasks' , async ()=> {
      const tempuser=await User.create({...user})
      const tempoboard=await onboard.create({...onboardUser})

      await supertest(app).post('/empUpdateToDo')
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('updated succesfully')
          const onboardusertemp= await onboard.findOne({empId : user.empId})
    //  console.log(onboardusertemp)
     expect(onboardusertemp.steps[0].isCompleted).toBeTruthy()

      })

  })
