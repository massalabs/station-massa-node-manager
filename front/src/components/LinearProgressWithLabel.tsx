import * as React from 'react';
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@mui/material';

const LinearProgressWithLabel: React.FC<
  LinearProgressProps & { value: number }
> = (props: LinearProgressProps & { value: number }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
