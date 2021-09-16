import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Typography
  } from '@material-ui/core';
  import "../styles/taskProgress.css"
  import { orange } from '@material-ui/core/colors';
  import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
  import {useEffect, useState} from "react";


  function TaskProgress({courses,tasks,isdetails}){
   const [taskscomp,setTaskcomp]=useState(0)
   const [courselist,setCourses]=useState([])
   var tempList1=[]
   for(let i=0;i<courses?.length;i++){
         
    var index=tempList1.findIndex(x=>x.id === courses[i].id)
    if(index>=0){
      console.log("courses exist")
    }else{
      tempList1.push(courses[i])
    }
  }
  var temp=courseCompletion(tempList1)
  if(isNaN(temp))
  {
    temp="0.00"
  }
  console.log("temp",temp)
    const [coursecomp,setCourseemp]=useState(temp)
 
    console.log("temp list",courseCompletion(tempList1),taskscomp,temp)
    const [tasklist,setTask]=useState([])

    useEffect(()=>{
     
        var tempList1=[]
        var tempList2=[]
        for(let i=0;i<courses?.length;i++){
         
          var index=tempList1.findIndex(x=>x.id === courses[i].id)
          if(index>=0){
            console.log("courses exist")
          }else{
            tempList1.push(courses[i])
          }
        }
        // if(courselist.length==0){
        // setCourses([...tempList1])
        // }
        setCourses([...tempList1])

        for(let i=0;i<tasks?.length;i++){
          console.log("task progress tasks",tasks.length)
          var index=tempList2.findIndex(x=>x.id === tasks[i].id)
          if(index>=0){
            console.log("task exist")
          }else{
            tempList2.push(tasks[i])
          }
        }
        if(tasklist.length==0){
        setTask([...tempList2])
        }
    
        setCourseemp(courseCompletion(courselist))
        setTaskcomp(taskcomplete(tasklist))
    },[courses,tasks])
   
    //  taskscomp=taskcomplete(tasklist)
    //  coursecomp=courseCompletion(courselist)
    function courseCompletion(courses){
      let sum=0
      courses.forEach((course)=>{
          sum+=course.amountCompleted
          
      })
  
      return ((sum/(courses.length*100))*100).toFixed(2)
  }
  function taskcomplete(tasks){
    let sum=0;
    tasks.forEach((tasks)=>{
      if(tasks.isCompleted){
        sum=sum+1
      }
    })
    return ((sum*100)/tasks.length).toFixed(2)
  }
    return(
    <Grid className="mainLayout" container spacing={2}>
      <Grid item xs={6} sm={6}>
            <Card className="mainCard">
              <CardContent>
                <Grid
                  container
                  spacing={3}
                  sx={6}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      ONBOARDING PROGRESS
                    </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {taskcomplete(tasklist)+"%"}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: orange[600],
                        height: 56,
                        width: 56
                      }}
                    >
                      <InsertChartIcon />
                    </Avatar>
                  </Grid>
                </Grid>
                <Box sx={{ pt: 3 }}>
                  <LinearProgress
                    value={taskcomplete(tasklist)}
                    variant="determinate"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Card className="mainCard">
              <CardContent>
                <Grid
                  container
                  spacing={3}
                  sx={6}
                >
                  <Grid item>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="h6"
                    >
                      COURSES PROGRESS
                    </Typography>
                    <Typography
                      color="textPrimary"
                      variant="h3"
                    >
                      {temp+'%'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        backgroundColor: orange[600],
                        height: 56,
                        width: 56
                      }}
                    >
                      <InsertChartIcon />
                    </Avatar>
                  </Grid>
                </Grid>
                <Box sx={{ pt: 3 }}>
                  <LinearProgress
                    value={temp}
                    variant="determinate"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
    </Grid>
  );
                    }
  
  export default TaskProgress;