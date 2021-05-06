import React from 'react';
import { Typography, Toolbar, AppBar } from '@material-ui/core';

const Header = (props) => {
  return (
    <AppBar>
      <Toolbar variant='dense' className='App-toolbar'>
        <Typography variant='h3'>{props.text}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
