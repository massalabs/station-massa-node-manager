import React from 'react';

import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import LinearProgressWithLabel from '../LinearProgressWithLabel';
import { NodeMonitor } from '../../types/NodeMonitor';

interface Props {
  nodeMonitor: NodeMonitor | undefined;
}

const RessourcesMonirotingCard: React.FC<Props> = (props: Props) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
        Hardware
      </Typography>
      <Card
        sx={{
          height: '250px',
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6">
            CPU
            <LinearProgressWithLabel
              value={props.nodeMonitor?.metrics.CPU ?? 0}
              color="success"
            />
          </Typography>
          <Typography variant="h6">
            RAM
            <LinearProgressWithLabel
              value={props.nodeMonitor?.metrics.RAM ?? 0}
              color="success"
            />
          </Typography>
          <Typography variant="h6">
            Disk
            <LinearProgressWithLabel
              value={props.nodeMonitor?.metrics.Disk ?? 0}
              color="warning"
            />
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default RessourcesMonirotingCard;
