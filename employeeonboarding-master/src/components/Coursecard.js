import React from 'react';
import {Card,CardTitle,CardFooter,CardContent} from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import '../styles/coursecard.css';
import {useState} from "react";
import { EmojiObjectsRounded } from '@material-ui/icons';
import Alert from './alertbox';
import server from '../keys';

function CourseCard(props){
const [amountCompleted,setcomplete]=useState(props.count)
const [coursename,setName]=useState(props.name)
const [empid,setEmpid]=useState(props.empid)
const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  
function IncreaseCount(){
  if(amountCompleted<100){
  setcomplete(amountCompleted+10)
  }
}
function DecreaseCount(){
  if(amountCompleted>0){
  setcomplete(amountCompleted-10)
  
}else{
    setcomplete(0)
  }
}
function completeCourse(){
  setcomplete(100)
  
}

function updateCourse(){
  const myHeaders2=new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
    'Content-Type':'application/json'
  });
  var requestOptions={
    method:'POST',
    headers:myHeaders2,
    body:JSON.stringify({
      steps: [{
        id:coursename,
        amountCompleted:amountCompleted
      }]
    })
}


fetch(`${server.url}empUpdateCourses`,requestOptions)
.then((response)=>response.json())
.then((data)=>{
  console.log(data)
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
  //window.location.reload()
  props.setisdetails(true)
})
setMessage('')
}

 return(
<div>
{message!==''?<Alert message={message} severity={severity} isClicked={openHandle}></Alert>:null}
<Card >
        <CardContent>
          <h3>{coursename}</h3>
          <p>Progress</p>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button className='add' onClick={DecreaseCount}>-</Button>
          {/* <Badge color="light" className='b1' >{"   "+props.count+"   "}</Badge> */}
          <p>{amountCompleted}</p>
          <Button className='sub' onClick={IncreaseCount}>+</Button>
          </ButtonGroup><br/>
          <Button color="primary" onClick={completeCourse}>Done</Button>
          <Button color="primary" onClick={updateCourse}>Submit</Button>   
        </CardContent>
        
      </Card>
</div>
 )  
}
export default CourseCard;