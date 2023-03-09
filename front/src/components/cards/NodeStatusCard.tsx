import React from 'react';
import { Card, CardContent, Skeleton, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import { NodeMonitor } from '../../types/NodeMonitor';

interface Props {
  nodeMonitor: NodeMonitor | undefined;
}

const NodeStatusCard: React.FC<Props> = (props: Props) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Up':
        return 'green';
      case 'Down':
      case 'Unknown':
        return 'error';
      default:
        return 'yellow';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Up':
        return <CheckCircleIcon sx={{ fontSize: 64 }} color="success" />;
      case 'Down':
      case 'Unknown':
        return <CancelIcon sx={{ fontSize: 64 }} color="error" />;
      case 'Bootstrapping':
      case 'Installing':
        return <PendingIcon sx={{ fontSize: 64 }} color="warning" />;
      default:
        return <HelpIcon sx={{ fontSize: 64 }} />;
    }
  };

  const getTooltip = (status: string | undefined): string => {
    switch (status) {
      case 'Up':
      case 'Bootstrapping':
      case 'Installing':
        return status;
      case 'Down':
        return "Server is up, but node is node running. Check the logs to identify the issue.";
      case 'Unknown':
        return "Server is not reachable. Check your connection settings and ssh access key.";
      default:
        return "";
    }
  };

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
        Status
      </Typography>
      <Card
        sx={{
          height: { xs: 'auto', sm: '250px' },
          width: 'auto',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Tooltip title={getTooltip(props.nodeMonitor?.status)}>
            {getStatusIcon(props.nodeMonitor?.status)}
          </Tooltip>
          <Typography
            variant={
              props.nodeMonitor?.status == 'Up' ??
                props.nodeMonitor?.status == 'Down'
                ? 'h4'
                : 'h6'
            }
            color={getStatusColor(props.nodeMonitor?.status)}
            sx={{ fontWeight: 'bold' }}
          >
            <Tooltip title={getTooltip(props.nodeMonitor?.status)}>
            <span>{props.nodeMonitor?.status as any ?? <Skeleton />}</span>
            </Tooltip>
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default NodeStatusCard;
