import { Route, Router, Switch } from 'react-router-dom'; 
import Account from './Pages/Accounts'
import Courses from './Pages/Courses';
import Employees from "./Pages/Employees"
import UserDashboard from "./Pages/UserDashboard"
import Registration from "./Pages/Registration"
import NewCourse from "./Pages/NewCourse"
import AddToDo from "./Pages/AddToDo"
import Login from './Pages/Login'

function RouteComp() {
    return(
        <div>
            <Switch>
                <Route path="/userDash" component={UserDashboard} />
                <Route exact path="/courses" component={Courses}/>
                <Route exact path="/ProfilePage" component={Account}/>
                <Route exact path="/AllEmployees" component={Employees}/>
                <Route exact path="/AllEmployees/newEmp" component={Registration} />
                <Route exact path="/courses/addCourse" component={NewCourse} />
                <Route exact path="/AddToDo" component={AddToDo} />
                <Route exact path="/logout" component={Login} />
            </Switch>
      </div>
    )
}

export default RouteComp;
