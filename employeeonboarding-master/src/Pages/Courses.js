import React, {useState,useEffect} from "react";
import { Row} from "reactstrap";
import {
    Button,
    Card,
    CardContent,
  } from '@material-ui/core';
import "../styles/courses.css"
import { makeStyles } from '@material-ui/core/styles';
import {  NavLink } from 'react-router-dom'; 
import Modal from '@material-ui/core/Modal';
import Alert from '../components/alertbox'
import server from "../keys";
import {useHistory} from 'react-router-dom';
function getModalStyle() {
  const top = 50
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({

  root: {
    '& > *': {
      margin: theme.spacing(1),
      float:"right"
    },
  },
  toolbar: {
    minHeight: 128,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: theme.spacing(9),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btn: {
    margin:"auto",
    textAlign:"center"
  },
  btn1: {
    margin:"5px",
  },
  btn2: {
    margin:"5px",
  },
}));



function Courses() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [courselist,setCourses]=useState([])
  const [selectedCard,setselectedCard]=useState(null)
  const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const [isupdated,setupdated]=useState(false)
  const [values, setValues] = useState({
    courseName:'',
    summary:'',
      weightage:''
  });
  useEffect(() => {
    console.log("from courses useeffect",isupdated)
    var tempList=[]
    // POST request using fetch inside useEffect React hook
    const myHeaders = new Headers({
      'Authorization': `Bearer ${localStorage.getItem('tokenId')}`
  });
     fetch(`${server.url}adminGetCourses`, {
      headers: myHeaders
    })
      .then(response => response.json())
      .then(data =>{
        // console.log('request',data.allCourses)
        for(let i=0;i<data.allCourses?.length;i++){
          var obj={
            courseImage:"Course Image",
            courseName : data.allCourses[i].courseName,
            weightage:data.allCourses[i].weightage,
            summary:data.allCourses[i].summary,
            
          }
          var index=tempList.findIndex(x=>x.courseName === obj.courseName)
          if(index>=0){
            console.log("courses exist")
          }else{
            tempList.push(obj)
          }
        }
        setCourses([...tempList])
      
        
      })
     setupdated(false) 
    },[isupdated])
    // This empty array is to make sure component is rendered only once
    //If passed something then it shows dynamic changes jaise change hua vaise change ho jaega

  
   

      // console.log(courselist)
    
  
      const handleChange = (event) => {
        console.log('check values',values)
        setValues({
          ...values,
          // courseName: selectedCard?.courseName,
          [event.target.name]: event.target.value
        });
      };

      const handleOpen = (index) => {
        setselectedCard(courselist[index])
        setValues(courselist[index])
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const myHeaders2=new Headers({
        'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
        'Content-Type':'application/json'
      });
       var history=useHistory()
      function editemployee(){
       
        var requestOptions={
          method:'POST',
          headers:myHeaders2,
          body:JSON.stringify({
            course : {
              'courseName' : values.courseName,
              'weightage': values.weightage,
              'summary' : values.summary
            }
          })
      }
      
      
      fetch(`${server.url}adminEditCourse`,requestOptions)
      .then((response)=>response.json())
      .then((data)=>{
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
     //  history.push("/courses")
     setupdated(true)
      })
      setValues({
        ...values,
        courseName:'',
        summary:'',
        weightage:'',
      })
      setMessage('')
      // console.log(values)
     
      
  
      }
      var cardjsx=courselist.map((c,index)=>{
        // console.log(c)
        return(
          <Card className="coursesCard">
          <CardContent>
            <table>
              <tr>
                <th>{c.courseName}</th>
                <th>{c.weightage}</th>
                <th>{c.summary}</th>
                
                <th> <Button variant="contained" color="default" onClick={()=> handleOpen(index)}>Edit</Button>
               
                
                 </th>
              </tr>
            </table>
          </CardContent>
        </Card>
        )
      })
  return(
    <>
    <div className="content123">
    {message!==''?<Alert message={message} severity={severity} isClicked={openHandle}></Alert>:null}
        <Row>
          <Card className="coursesTitle">
              <h5 className="title">All Courses Available</h5>
              <NavLink to="/courses/addCourse">
                <div className={classes.root}>
                  <Button variant="contained" color="primary">Add Course</Button>
                </div>
              </NavLink>
          </Card>
        </Row>
        <Row>
          <Card style={{"background": "white", "marginBottom":"2px","height":"50px"}}>
            <table height="50px">
              <tr>
                <th>COURSE NAME</th>
                <th>WEIGHTAGE</th>
                <th>SUMMARY</th>
                <th></th>
              </tr>
            </table>
            </Card>
        </Row>
        <Row>
          {cardjsx}
          </Row>
          <Modal
              open={open}
              onClose={handleClose}
            >
              <div style={modalStyle} className={classes.paper}>
                <table>
                  <tr>
                    <th>Course Name:</th>
                    <td><input type="text" name="courseName" value={selectedCard?.courseName} onChange={handleChange}  /></td>
                  </tr>
                  <tr>
                    <th>Summary:</th>
                    <td><input type="text" name="summary" onChange={handleChange} defaultValue={selectedCard?.summary} /></td>
                  </tr>
                  <tr>
                    <th>Weightage:</th>
                    <td><input type="text"   name="weightage" onChange={handleChange}  defaultValue={selectedCard?.weightage}/></td>
                  </tr>
                  
                  {/* <tr>
                    <td><Button variant="contained" color="primary" onClick={handleClose}>Close</Button></td>
                    <td><Button variant="contained" color="primary">Save</Button></td>
                  </tr> */}
                </table>
                <div className={classes.btn}>
                  <Button className={classes.btn1} variant="contained" color="primary" onClick={handleClose}>Close</Button>
                  <Button className={classes.btn2} variant="contained" color="primary" onClick={editemployee}>Save</Button>
                </div>
              </div>
            </Modal>
        </div>
    </>
  );
}

export default Courses;
