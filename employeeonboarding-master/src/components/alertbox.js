// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { Alert, AlertTitle } from '@material-ui/lab';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     '& > * + *': {
//       marginTop: theme.spacing(2),
//     },
//   },
//   alertBox: {
//       textAlign:'center',
//       alignItems:'center'
//   }
// }));

// export default function DescriptionAlerts({message,severity}) {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Alert severity={severity} autoHideDuration={6000}>
//         <AlertTitle className={classes.alertBox}>{message}</AlertTitle>
//         <strong className={classes.alertBox}> Information Updated Successfully </strong>
//       </Alert>
//     </div>
//   );
// }

import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars({message,severity,isClicked}) {
  const classes = useStyles();
  console.log('in alert',message,severity)
  const [open, setOpen] = React.useState(false);

  useEffect(()=> {
      setOpen(Boolean(message))
  },[Boolean[message]])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

    useEffect(()=> {
        setTimeout(()=> {
            if(open)
            {
                setOpen(!open)
            }
        },6000)
    })
  ;

  return (
    <div className={classes.root}>
      <Snackbar open={open && isClicked} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
