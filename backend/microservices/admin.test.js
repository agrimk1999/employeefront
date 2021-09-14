const app=require('./admin.service')
const mongoose=require('mongoose')
const supertest=require('supertest')
const User=require('../models/user.model')
const onBoard=require('../models/onboarding.model')
const Course=require('../models/course.model')




let user={
    firstName : 'Agrim',
    lastName : 'Khurana',
    empId : 'EMP001',
    address : 'Indore',
    dob : '04-05-1999',
    designation : 'Manager',
    email : 'agrimkh54321@gmail.com',
    googleId : '1234',
    role : 1
}

let users=[
    { 
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
    },
   { 
    firstName : 'Raju',
    lastName : 'Sharma',
    empId : 'EMP003',
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
    address : 'Indore',
    dob : '04-06-1999',
    designation : 'Associate',
    email : 'rsha@gmail.com',
    googleId : '123456',
    role : 0
   }

]

let updateUser={
    firstName : 'Ayush',
        lastName : 'Sharma',
        empId : 'EMP002',
        courseID : [
            {
                id : 'EXCEL',
                amountCompleted : 0
            }
        ],
        address : 'Bangalore',
        dob : '04-05-1999',
        designation : 'Associate',
        email : 'asonthalia@gmail.com',
        googleId : '1234',
        role : 0
    
}

let onBoardTask={
    designation : 'Software',
    tasks : [
        {
            id : 'submit pan',
            isCompleted : 0
        },
        {
            id : 'laptop',
            isCompleted : 0
        }
    ]
}

let taskforAll = {
    tasks : [
        {
            id : 'submit pan',
            isCompleted : false
        },
        {
            id : 'laptop',
            isCompleted : false
        }
    ]
}

let courseAll=[
    {
        courseID : 'J',
        courseName : 'JAVA',
        summary : 'Learn Java',
        weightage : 30
    },{
        courseID : 'C',
        courseName : 'C',
        summary : 'Learn C',
        weightage : 10
    },
    {
        courseID : 'E',
        courseName : 'EXCEL',
        summary : 'Learn Excel',
        weightage : 20
    }
]

let courseDesignation= {
    designation : 'Software',
    courses : [
        {
            id : 'PYTHON',
            amountCompleted : 0
        },
        {
            id : "REDUX",
            amountCompleted : 0
        }
    ]
}

let courses = [
    {
        courseID : 'J',
        courseName : 'Java',
        summary : 'Do Java Course',
        weightage : 30
    },
    {
        courseID : 'C',
        courseName : 'C',
        summary : 'Do C Course',
        weightage : 10
    },
    {
        courseID : 'R',
        courseName : 'REDUX',
        summary : 'Do REDUX Course',
        weightage : 30
    },
    {
        courseID : 'C++',
        courseName : 'C++',
        summary : 'Do C++ Course',
        weightage : 40
    },
    {
        courseID : 'P',
        courseName : 'Python',
        summary : 'Do Python Course',
        weightage : 25
    },
    {
        courseID : 'NE',
        courseName : 'Node Express',
        summary : 'Do Node and Express Course',
        weightage : 50
    }
]



beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
      { useNewUrlParser: true, useUnifiedTopology: true }, ()=> {
        User.insertMany({...user},()=> {
            done()
          })
      })

    
      
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => {
          done()
        })
    });
    
  });



 let token='eyJhbGciOiJIUzI1NiJ9.YWdyaW1raDU0MzIxQGdtYWlsLmNvbQ.lA8bDKiqXAoMIlSam7dQBqwVfYtVfhoD1o5MALiBVbA'

  test('GET All Users for Admin' , async ()=> {
      await User.insertMany(users)

      await supertest(app).get('/adminDashboardEmployee')
      .set('Authorization',"Bearer "+token)
      .expect(200)
      .then((response)=> {
        //   console.log(response.body.finalOutput.courseUsers)
          expect(response.body.finalOutput.courseUsers.length).toBe(2)
          expect(response.body.finalOutput.taskUsers.length).toBe(0)
          expect(response.body.finalOutput.courseUsers[0].empId).toBe('EMP002')
          expect(response.body.finalOutput.courseUsers[1].empId).toBe('EMP003')
      })
  })


  test('POST Add an employee' , async ()=> {
      const tempUser=users[0]
      await supertest(app).post('/adminAddEmployee')
      .set('Authorization',"Bearer "+token)
      .set('Accept', 'application/json')
      .send(tempUser)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          let output=await User.findOne({empId : 'EMP002'})
          let onboardOutput=await onBoard.findOne({empId : 'EMP002'})
        //   console.log(output)

          expect(output.firstName).toBe('Ayush')
          expect(onboardOutput.designation).toBe('SOFTWARE')
          
    
      })

     

  })

  test('POST update an employee' , async ()=> {
    await User.create({...users[0]})
    await onBoard.create({
        designation : 'SOFTWARE',
        designation_id: 'S',
        empId : 'EMP002'
    })
      await supertest(app).post('/editAnEmployee')
      .set('Authorization',"Bearer "+token)
      .send(updateUser)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('edited successfully')
           await User.findOne({empId : 'EMP002'}).then((output)=> {
            expect(output.lastName).toBe('Sharma')
            expect(output.courseID.length).toBe(4)
            expect(output.courseID[3].id).toBe('EXCEL')
          })
        //   console.log(output)
          

          await onBoard.findOne({empId : 'EMP002'}).then((onboardOutput)=> {
            expect(onboardOutput.designation_id).toBe('A')
            expect(onboardOutput.designation).toBe('ASSOCIATE')
          })
          
      })

     
  })


  test('POST add onboarding task', async ()=> {
      await onBoard.create({
          designation : 'Software',
          empId : 'EMP002',
          designation_id: "S"
      })

      await supertest(app).post('/addToDo')
      .send(onBoardTask)
      .set('Authorization',"Bearer "+token)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await onBoard.find({designation : 'Software'})
          expect(output.length).toBe(1)
          expect(output[0].steps.length).toBe(2)
          expect(output[0].steps[0].isCompleted).toBeFalsy()
      })
  })


  test('POST onboarding task for all' , async ()=> {
      await onBoard.insertMany([
          {
            designation : 'Software',
            empId : 'EMP002',
            designation_id: "S"
          },{
            designation : 'Associate',
            empId : 'EMP003',
            designation_id: "A"
          }
      ])

      await supertest(app).post('/addToDoforAll')
      .set('Authorization',"Bearer "+token)
      .send(taskforAll)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await onBoard.find({})
          expect(output.length).toBe(2)
          expect(output[0].empId).toBe('EMP002')
          expect(output[1].empId).toBe('EMP003')
          expect(output[0].steps.length).toBe(2)
          expect(output[1].steps.length).toBe(2)
      })

  })


  test('POST add course' , async ()=> {

    await supertest(app).post('/adminAddCourse')
    .set('Authorization',"Bearer "+token)
    .send(courseAll)
    .expect(200)
    .then(async (response)=> {
        expect(response.body.message).toBe('added successfully')
        const output=await Course.find({})
        // console.log(output)
        expect(output.length).toBe(3)
        expect(output[0].courseID).toBe('J')
        expect(output[1].weightage).toBe(10)
        expect(output[2].courseName).toBe('EXCEL')
    })



  })



  test('POST add course for designation' , async ()=> {
      await User.create({...users[0]})
      await User.create({...users[1]})

      await supertest(app).post('/adminCourseDesignation')
      .set('Authorization',"Bearer "+token)
      .send(courseDesignation)
      .expect(200)
      .then(async (response)=> {
          expect(response.body.message).toBe('added successfully')
          const output=await User.find({designation : 'Software'})
          expect(output.length).toBe(1)
          expect(output[0].courseID.length).toBe(5)
      })
  })


  test('GET all courses for admin', async ()=> {
      await Course.insertMany(courses).then(async (result)=> {
        //   console.log(result)
          await supertest(app).get('/adminGetCourses')
          .set('Authorization',"Bearer "+token)
          .expect(200)
          .then((response)=> {
              expect(response.body.allCourses.length).toBe(6)
              expect(response.body.allCourses[4].courseName).toBe('PYTHON')
              expect(response.body.allCourses[5].courseName).toBe('NODE EXPRESS')   
              expect(response.body.allCourses[5].weightage).toBe(50)    
               })
      })
  })