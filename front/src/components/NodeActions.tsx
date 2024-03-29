import React from 'react';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import Node from '../types/Node';
import { localApiGet, localApiPost } from '../request';
import { NodeMonitor } from '../types/NodeMonitor';
import leftArrow from '../assets/left-arrow.svg';
import { saveAs } from "file-saver";

const startNodeRequest = (id: string): Promise<any> => {
  return localApiPost(`start_node?id=${id}`, {});
};

const stopNodeRequest = (id: string): Promise<any> => {
  return localApiPost(`stop_node?id=${id}`, {});
};

const backupWalletRequest = (id: string): Promise<any> => {
  return localApiGet(`backup_wallet?id=${id}`, {responseType: 'blob'});
};

interface Props {
  nodeMonitor: NodeMonitor | undefined;
  fetchMonitoring: () => any;
  forceIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  fetchNodes: () => any;
  selectedNode: Node;
}

const NodeActions: React.FC<Props> = (props: Props) => {
  const [isStartingNode, setIsStartingNode] = React.useState<boolean>(false);
  const [isStoppingNode, setIsStoppingNode] = React.useState<boolean>(false);

  const canStart = () => {
    return props.nodeMonitor?.status === 'Down';
  };

  const handleStart = (force = false) => {
    if (force || canStart()) {
      setIsStartingNode(true);
      startNodeRequest(props.selectedNode.Id)
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsStartingNode(false);
          props.fetchMonitoring();
        });
    }
  };

  const canStop = () => {
    const status = props.nodeMonitor?.status;
    return status === 'Up' || status === 'Bootstrapping' || status === 'Installing';
  };

  const handleStop = () => {
    if (canStop()) {
      setIsStoppingNode(true);
      stopNodeRequest(props.selectedNode.Id)
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsStoppingNode(false);
          props.fetchMonitoring();
        });
    }
  };

  const canBackup = () => {
    const status = props.nodeMonitor?.status;
    return status !== 'Unknown';
  };

  const handleBackup = () => {
    if (canBackup()) {
      const zipName = `${props.selectedNode.Id}_wallet_backup.zip`;
      backupWalletRequest(props.selectedNode.Id)
        .then(({data: blob}) => saveAs(blob, zipName))
        .catch((error) => {
          console.error('Error downloading wallet_backup.zip:', error);
        });
    }
  };

  const handleEditSettings = () => {
    props.forceIsUpdating(true);
  };

  return (
    <Grid container justifyContent={"center"}>
    <Grid
        item
        sx={{
          textAlign: 'center',
          marginBottom: {
            xs: '20px',
            lg: '0px',
          },
          justifySelf: 'start',
          width: '64px', height: '64px',
        }}
        >
          <Button onClick={() => handleEditSettings()}>

                            <img
                    src={leftArrow}
                    width="40"
                    alt="React Logo"
                    style={{ borderRadius: 4 }}
                    
                    />
                    </Button>
          <Typography fontSize={"0.7rem"}>Edit Settings</Typography>
        </Grid>
      <Grid
        item
        sx={{
          textAlign: 'center',
          marginTop: {
            xs: '15px',
            lg: '0px',
          },
          marginLeft: {xs:"auto", sm:"30px", md:"auto"},
          marginRight: "auto"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStart()}
          disabled={!canStart()}
          sx={{ borderRadius: 8, width: '256px', height: '64px' }}
        >
          {isStartingNode ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h6">Start</Typography>
          )}
        </Button>
      </Grid>
      <Grid
        item
        sx={{
          textAlign: 'center',
          marginTop: {
            xs: '15px',
            lg: '0px',
            mx: "auto"
          },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleStop}
          disabled={!canStop()}
          sx={{ borderRadius: 8, width: '256px', height: '64px' }}
          >
          {isStoppingNode ? (
            <CircularProgress size={24} />
            ) : (
              <Typography variant="h6">Stop</Typography>
              )}
        </Button>
      </Grid>
      <Grid
        item
        sx={{
          textAlign: 'center',
          marginTop: {
            xs: '15px',
            lg: '0px',
          },
          mx: "auto"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStart(true)}
          sx={{ borderRadius: 8, width: '256px', height: '64px' }}
        >
          {isStartingNode ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h6">Restart</Typography>
            )}
        </Button>
      </Grid>
      <Grid
        item
        sx={{
          textAlign: 'center',
          marginTop: {
            xs: '15px',
            lg: '0px',
          },
          mx: "auto",
          marginLeft:"20px"
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackup}
          sx={{ borderRadius: 8, width: '256px', height: '64px' }}
        >
          <Typography variant="h6">Backup wallet</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default NodeActions;
