import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  Card,
  Box,
  Button
} from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import "../styles/toDo.css";
import {useState} from "react";
import Alert from './alertbox';
import server from '../keys';
export default function FullWidthGrid({tasks,setisdetails}) {
console.log(tasks)
  const [state, setState] = React.useState({
    Task1: true,
    Task2: false,
    Task3: false,
  });

  const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const handleChange = (event) => {
    // console.log(state)
        var idx=tasklist.findIndex(x=>x.id === event.target.name)
        tasklist[idx].isCompleted=event.target.checked
    //setState({ ...state, [event.target.name]: event.target.checked });
    console.log('Index tasklist',tasklist[idx])
    setTask([...tasklist])
  };

  const myHeaders2=new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
    'Content-Type':'application/json'
  });
const [tasklist,setTask]=useState([])

useEffect(()=>{
  var tempList=[]
    for(let i=0;i<tasks?.length;i++){
      var index=tempList.findIndex(x=>x.id === tasks[i].id)
      if(index>=0){
        console.log("task exist")
      }else{
        tempList.push(tasks[i])
      }
    }
    if(tasklist.length==0){
    setTask([...tempList])
    }
    // console.log('templist printing',tasklist)
},[tasks])
    // console.log('tasklist printing',tasklist)
//  useEffect(()=> {
//   fetch(`http://localhost:7901/empDashboard/${localStorage.getItem('empId')}`,{
//     headers:myHeaders
//   })
//   .then(response => response.json())
//   .then(data =>{
//     var tempList=[]
//     for(let i=0;i<data.emp.tasks.steps.length;i++){
//       var index=tempList.findIndex(x=>x.id === data.emp.tasks.steps[i].id)
//       if(index>=0){
//         console.log("task exist")
//       }else{
//         tempList.push(data.emp.tasks.steps[i])
//       }
//     }
//     setTask([...tempList])
//   })
//  },[])

  function updateTasks(){
    
    var tempList=tasklist.filter((t)=> {
      return t.isCompleted==true
    })
    console.log('update tasks',tempList)
    var requestOptions={
      method:'POST',
      headers:myHeaders2,
      body:JSON.stringify({
       tasks:tempList
      })
  }
  fetch(`${server.url}empUpdateToDo`,requestOptions)
  .then((response)=>response.json())
  .then((data)=>{
    console.log('status check',data)
     if(data.message.length>0)
     {
      if(data.message==='added successfully')
      {
      setMessage('Added Successfully')
      setSeverity('success')
      setOpenHandle(true)
      }else if(data.message==='Unauthorized Access - Not an Admin!')
      {
        setMessage(data.message)
      setSeverity('warning')
      setOpenHandle(true)
      }else{
        setMessage(data.message)
      setSeverity('warning')
      setOpenHandle(true)
      }
     }else{
       setMessage('Sorry unable to make a request at this moment')
       setSeverity('error')
       setOpenHandle(true)
     }
   // window.location.reload()
   setisdetails(true)
  })
  setMessage('')
  }
  return(
    <div className="toDo123">
    {message!==''?<Alert message={message} severity={severity} isClicked={openHandle}></Alert>:null}
    <Card >
      <h1>To Do Tasks</h1>
      <FormControl component="fieldset" variant="standard">
        <FormGroup>
            {
                 tasklist.map((t)=>{
                         return(
                                <FormControlLabel
                                          control={
                                        <Checkbox checked={t.isCompleted} disabled={t.isCompleted} onChange={handleChange} name={t.id} />
                                                   }
                                       label={t.id}
                                />
                               )
                                   }
                                ) }
       </FormGroup>
       
    </FormControl>
    <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={updateTasks}
          >
            Submit Tasks
          </Button>
        </Box>
  </Card>
  
</div>  );
}
