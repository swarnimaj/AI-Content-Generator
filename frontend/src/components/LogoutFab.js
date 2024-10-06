// src/components/LogoutFab.js
import React, { useState } from 'react';
import { Fab, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';

const ExpandingFab = styled(Fab)(({ theme, expanded }) => ({
  position: 'fixed',
  top: 20,  // Changed from bottom to top
  right: 20,
  transition: 'all 0.3s',
  width: expanded ? 140 : 56,
  height: 56,
  borderRadius: 28,
  overflow: 'hidden',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const IconWrapper = styled(Box)({
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
});

const TextWrapper = styled(Box)(({ expanded }) => ({
  position: 'absolute',
  left: 56,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: expanded ? 1 : 0,
  transition: 'opacity 0.3s',
}));

const LogoutFab = ({ onLogout }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpandingFab
      color="primary"
      aria-label="logout"
      expanded={expanded}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={onLogout}
    >
      <IconWrapper>
        <LogoutIcon />
      </IconWrapper>
      <TextWrapper expanded={expanded}>
        <Typography sx={{ whiteSpace: 'nowrap' }}>Logout</Typography>
      </TextWrapper>
    </ExpandingFab>
  );
};

export default LogoutFab;