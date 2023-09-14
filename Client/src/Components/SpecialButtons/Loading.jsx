import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Stack } from '@mui/material';
import { p } from '../General/Theme';

export default function Loading() {
  return (
    <Stack sx={{ display: 'flex', justifyContent:'center', alignItems:'center',  minHeight: '80vh'  }}>
      <CircularProgress size="70px" sx={{color: p}}/>
    </Stack>
  )
}


