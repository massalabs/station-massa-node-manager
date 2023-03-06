import React from 'react';

import { AppBar, Toolbar, Typography } from '@mui/material';

import Node from '../types/Node';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="transparent">
      <Toolbar style={{ paddingLeft: 0 }}>
        <img src="logo.svg" alt="logo" height="64px" />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Node Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
