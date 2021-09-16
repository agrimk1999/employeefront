// import moment from 'moment';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography
  } from '@material-ui/core';
  import "../styles/existingToDo.css"
  
  const ExistingToDo = (props) => (
    <Card {...props}>
      <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
            Existing To Do
          </Typography>
          <Card className="tasks">
              Task 1
          </Card>
          <Card className="tasks">
              Task 2
          </Card>
          <Card className="tasks">
              Task 3
          </Card>
      </CardContent>
      <Divider />
    </Card>
  );
  
  export default ExistingToDo;