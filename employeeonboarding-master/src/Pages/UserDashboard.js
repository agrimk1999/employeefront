import '../styles/userDashboard.css';
import Progress from "../components/TaskProgress"
import ToDo from "../components/toDoList"
import Slideshow from '../components/Slideshow';
// import Slideshow from "../components/Slideshow"

function UserDashboard() {

  return (
    <div className="App123">
      <div className="progress">
        <Progress />
      </div>
      <div className="toDoList">
        <ToDo />
      </div>
      <div className="carousel">
        <Slideshow /> 
      </div>
    </div>
  );
} 

export default UserDashboard;
