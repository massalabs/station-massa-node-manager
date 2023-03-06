import React from "react";

import { Button, CircularProgress, Grid, Typography } from "@mui/material";

import NodeStatus from "../types/NodeStatus";
import Node from "../types/Node";

import { apiPost, localApiGet, localApiPost, request } from "../request";
import { NodeMonitor } from "../types/NodeMonitor";
import axios from "axios";

const startNodeRequest = (id: string): Promise<any> => {
    return localApiPost(`start_node?id=${id}`, {});
};

const stopNodeRequest = (id: string): Promise<any> => {
    return localApiPost(`stop_node?id=${id}`, {});
};

const backupWalletRequest = (id: string): Promise<any> => {
    return localApiGet(`backup_wallet?id=${id}`);
};

interface Props {
    nodeStatus: NodeStatus | undefined;
    nodeMonitor: NodeMonitor | undefined;
    fetchNodeStatus: () => any;
    fetchMonitoring: () => any;
    selectedNode: Node;
}

const NodeActions: React.FC<Props> = (props: Props) => {
    const [isStartingNode, setIsStartingNode] = React.useState<boolean>(false);
    const [isStoppingNode, setIsStoppingNode] = React.useState<boolean>(false);

    const canStart = () => {
        return props.nodeMonitor?.status !== "Up";
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
        return status === "Up" || status === "Bootstrapping";
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

    const handleBackup = () => {
        if (canStop()) {
            backupWalletRequest(props.selectedNode.Id)
                .then((response) => {
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "wallet_backup.zip");
                    document.body.appendChild(link);
                    link.click();
                })
                .catch((error) => {
                    console.error(
                        "Error downloading wallet_backup.zip:",
                        error
                    );
                });
        }
    };

    return (
        <Grid
            container
            justifyContent="space-evenly"
        >
            <Grid
                item
                sx={{
                    textAlign: "center",
                    marginTop: {
                        xs: "15px",
                        sm: "15px",
                        md: "15px",
                        lg: "0px",
                    },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStart()}
                    disabled={!canStart()}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
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
                    textAlign: "center",
                    marginTop: {
                        xs: "15px",
                        sm: "15px",
                        md: "15px",
                        lg: "0px",
                    },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStop}
                    disabled={!canStop()}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
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
                    textAlign: "center",
                    marginTop: {
                        xs: "15px",
                        sm: "15px",
                        md: "15px",
                        lg: "0px",
                    },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStart(true)}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
                >
                    {isStartingNode ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Typography variant="h6">Update</Typography>
                    )}
                </Button>
            </Grid>
            <Grid
                item
                sx={{
                    textAlign: "center",
                    marginTop: {
                        xs: "15px",
                        sm: "15px",
                        md: "15px",
                        lg: "0px",
                    },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackup}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
                >
                    <Typography variant="h6">Backup wallet</Typography>
                </Button>
            </Grid>
        </Grid>
    );
};

export default NodeActions;
