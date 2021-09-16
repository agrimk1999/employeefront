import React, {useState,useEffect} from "react";
import { Row, Col} from "reactstrap";
import {
    Button,
    Card,
    CardContent,
  } from '@material-ui/core';
import "../styles/employees.css"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import PanelHeader from "../components/PanelHeader";
import { NavLink } from 'react-router-dom';
import Alert from '../components/alertbox'
import server from "../keys";
function getModalStyle() {
  const top = 50
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        float:"right"
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

function Employees() {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [values, setValues] = useState({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      empId:"",
      designation: "",
      dob: "",
      doj : ""
    });
    const [message,setMessage]=useState('')
  const [severity,setSeverity]=useState('')
  const [openHandle,setOpenHandle]=useState(false)
  const [isupdated,setupdated]=useState(false)
    function getDate(today){
      var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    return today
    }
    const [selectedCard,setselectedCard]=useState(null)

    const handleChange = (event) => {
      console.log('check values',values)
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    };

    const handleOpen = (index) => {
      setselectedCard(emplist[index])
      setValues(emplist[index])
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const [emplist,setEmpList]=useState([])
    const myHeaders = new Headers({
      'Authorization': `Bearer ${localStorage.getItem('tokenId')}`
  });
    useEffect(() => {
      console.log("from employees useeffect",isupdated)
      var tempList=[]
      // POST request using fetch inside useEffect React hook
      fetch(`${server.url}adminDashboardEmployee`, {
        headers: myHeaders
      })
      .then(response => response.json())
      .then(data =>{
       console.log(data)
       function courseCompletion(courses){
        let sum=0
        // console.log('in course completion',courses)
        courses.forEach((course)=>{
          sum+=course.amountCompleted
          console.log(sum,course.amountCompleted)
      })
    
    
        return ((sum/(courses.length*100))*100).toFixed(2)
    }

    function taskCompletion(task){
      let count=0
      task.forEach((t)=> {
        if(t.isCompleted)
        {
          count++;
        }
      })
      return ((count/task.length)*100).toFixed(2)
    }
        for(let i=0;i<data.finalOutput.courseUsers.length;i++){
          var obj={
            empId:data.finalOutput.courseUsers[i].empId,
            firstName:data.finalOutput.courseUsers[i].firstName,
            lastName:data.finalOutput.courseUsers[i].lastName,
            designation:data.finalOutput.courseUsers[i].designation,
            email:data.finalOutput.courseUsers[i].email,
            address: data.finalOutput.courseUsers[i].address,
            dob: data.finalOutput.courseUsers[i].dob,
            doj: data.finalOutput.courseUsers[i].doj,
            courseComplte:courseCompletion(data.finalOutput.courseUsers[i].courseID),
            TaskComplte:0
          }
         // console.log(obj)
          var index=tempList.findIndex(x=>x.empId === obj.empId)
          if(index>=0){
            console.log("employee exist")
          }else{
            tempList.push(obj)
          }
        }
        console.log(tempList)
      for(let i=0;i<data.finalOutput.taskUsers.length;i++){
        var index=tempList.findIndex(x=> x.empId === data.finalOutput.taskUsers[i].empId)
        if(index>=0)
        {
          var obj=tempList[index]
          obj.TaskComplte=taskCompletion(data.finalOutput.taskUsers[i].steps)
        }

      }
      console.log(tempList)
      setEmpList([...tempList])
    })
    setupdated(false) 
      },[isupdated])
   const myHeader2= new Headers({
    'Authorization': `Bearer ${localStorage.getItem('tokenId')}`,
    'Content-type':'application/json'
});
    function editemployee(){
      var requestOptions={
        method:'POST',
        headers:myHeader2,
        body:JSON.stringify(values)
    }
    
    
    fetch(`${server.url}editAnEmployee`,requestOptions)
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
      setValues({
        ...values,
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        empId:"",
        designation: "",
        dob: "",
        doj : ""
      })

   //  window.location.reload()
   setupdated(true)
    })
     setMessage('')
    console.log(values)
      

    }
  return(
    <>
    <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md={12}>
            <Card className="employeeTitle">
                <h5 className="title">All Employees</h5>
                <NavLink to="/AllEmployees/newEmp">
                  <div className={classes.root}>
                      <Button variant="contained" color="primary">Add New Employee</Button>
                  </div>
                </NavLink>
            </Card>
          </Col>
        </Row>
        {
          emplist.map((e,index)=>{
            return(
              <Card className="employeeCard">
              <CardContent>
                <table>
                  <tr>
                    <th>{e.firstName}</th>
                    <th>{e.lastName}</th>
                    <th>{e.empId}</th>
                    <th>{e.designation}</th>
                   <th>{e.address}</th>
                   <th>{getDate(new Date(e.dob))}</th>
                   <th>{getDate(new Date(e.doj))}</th>
                    <th>{e.email}</th>
                    <th>{!isNaN(e.courseComplte)?e.courseComplte+"%": "No courses assigned"}</th>
                    <th>{!isNaN(e.TaskComplte)?e.TaskComplte+"%" : "No tasks assigned"}</th>
                    <th> 
                  <Button variant="contained" color="default" onClick={()=> handleOpen(index)}>Edit</Button>
                 
                </th>
                  </tr>
                </table>
              </CardContent>
            </Card> 
              
            )
          })
        }
          
        {message!==''?<Alert message={message} severity={severity} isClicked={openHandle}></Alert>:null}
         <Modal
                    open={open}
                    onClose={handleClose}
                  >
                  
                    <div style={modalStyle} className={classes.paper}>
                      <table>
                        <tr>
                          <th>First Name:</th>
                          <td><input type="text" name="firstName" defaultValue={selectedCard?.firstName} onChange={handleChange}  /></td>
                        </tr>
                        <tr>
                          <th>Last Name:</th>
                          <td><input type="text" name="lastName" defaultValue={selectedCard?.lastName} onChange={handleChange}  /></td>
                        </tr>
                        <tr>
                          <th>Designation:</th>
                          <td><input type="text"   name="designation" defaultValue={selectedCard?.designation} onChange={handleChange}  /></td>
                        </tr>
                        <tr>
                          <th>Address:</th>
                          <td><input type="text" name="address" defaultValue={selectedCard?.address} onChange={handleChange}  /></td>
                        </tr>
                        <tr>
                          <th>Email Id:</th>
                          <td><input type="text"  name="email"  defaultValue={selectedCard?.email} onChange={handleChange}  disabled/></td>
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




export default Employees;






































// // import { Helmet } from 'react-helmet';
// import { Box, Container } from '@material-ui/core';
// import CustomerListResults from '../components/EmployeeListResults';
// import CustomerListToolbar from '../components/EmployeeListToolBar';
// import customers from '../mocks/customer';

// const Employee = () => (
//   <>
//     <Box
//       sx={{
//         backgroundColor: 'background.default',
//         minHeight: '100%',
//         py: 3
//       }}
//     >
//       <Container maxWidth={false}>
//         <CustomerListToolbar />
//         <Box sx={{ pt: 3 }}>
//           <CustomerListResults customers={customers} />
//         </Box>
//       </Container>
//     </Box>
//   </>
// );

// export default Employee;

