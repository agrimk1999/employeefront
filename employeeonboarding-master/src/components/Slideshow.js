import React, { useEffect } from 'react';
import Carousel from 'react-elastic-carousel';
import CourseCard from './Coursecard';
import {useState} from "react";

function Slideshow({courses,setisdetails,isdetails}){
  const myHeaders=new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
  });
 
const breakpoints=[
  {width:1,itemsToShow:1},
  {width:300,itemsToShow:2},
  {width:600,itemsToShow:3},
  {width:1000,itemsToShow:4}
]
const [courselist,setCourses]=useState([])
const [empid,setEmpid]=useState('')
const [designation,setDesignation]=useState('')
useEffect(()=>{
  var tempList=[]
    for(let i=0;i<courses?.length;i++){
      var index=tempList.findIndex(x=>x.id === courses[i].id)
      if(index>=0){
        console.log("task exist")
      }else{
        tempList.push(courses[i])
      }
    }
    if(courselist.length==0){
      setCourses([...tempList])
    }
    // console.log('templist printing',tasklist)
    
},[courses,isdetails])





  return(
    <div>
       <Carousel breakPoints={breakpoints}>
         {
           courselist.map((c)=>{
             return(
               <>
               <CourseCard name={c.id} count={c.amountCompleted} empid={empid} setisdetails={setisdetails} isdetails={isdetails} />
               </>
             )
           })
         }
       </Carousel>
    </div>
  )
}
export default Slideshow