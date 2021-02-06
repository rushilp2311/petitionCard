import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    fontSize: 13,
    color: 'white',
    backgroundColor: '#353636',
  },
  input: {
    display: 'none',
  },
}));

export default function OutlinedButtons(props) {
  const classes = useStyles();

  return (
    <div>
      <Button
        fullWidth={true}
        startIcon={props.startIcon}
        size='large'
        color={props.color}
        onClick={props.handleClick}
        variant='contained'
        style={{ fontWeight: 600, zIndex: 500 }}
        className={classes.button}>
        {props.label}
      </Button>
    </div>
  );
}
