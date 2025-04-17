import React from 'react';
import { Button } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TutorialButton = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<HelpOutlineIcon />}
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      튜토리얼 시작
    </Button>
  );
};

export default TutorialButton; 