import React from "react";

import { Button, CircularProgress, Grid, Typography } from "@mui/material";

import NodeStatus from "../types/NodeStatus";
import NodeState from "../types/NodeState";

import request from "../request";

const startNodeRequest = (): Promise<any> => {
    return request("POST", `http://localhost:${window.location.port}/start_node`, {});
};

const stopNodeRequest = (): Promise<any> => {
    return request("POST", `http://localhost:${window.location.port}/stop_node`, {});
};

interface Props {
    nodeStatus:
        | { status: NodeStatus | undefined; state: NodeState }
        | undefined;
    fetchNodeStatus: () => void;
}

const NodeActions: React.FC<Props> = (props: Props) => {
    const [isStartingNode, setIsStartingNode] = React.useState<boolean>(false);
    const [isStoppingNode, setIsStoppingNode] = React.useState<boolean>(false);

    const handleStart = () => {
        if (props.nodeStatus?.state === "STOPPED") {
            setIsStartingNode(true);
            startNodeRequest()
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsStartingNode(false);
                    props.fetchNodeStatus();
                });
        }
    };

    const handleStop = () => {
        if (props.nodeStatus?.state !== "STOPPED") {
            setIsStoppingNode(true);
            stopNodeRequest()
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsStoppingNode(false);
                    props.fetchNodeStatus();
                });
        }
    };

    return (
        <Grid
            container
            spacing={2}
            justifyContent="space-evenly"
            sx={{ mx: 2 }}
        >
            <Grid item sx={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStart}
                    disabled={props.nodeStatus?.state !== "STOPPED"}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
                >
                    {isStartingNode ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Typography variant="h6">Start</Typography>
                    )}
                </Button>
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStop}
                    disabled={props.nodeStatus?.state === "STOPPED"}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
                >
                    {isStoppingNode ? (
                        <CircularProgress size={24} />
                    ) : (
                        <Typography variant="h6">Stop</Typography>
                    )}
                </Button>
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={true}
                    sx={{ borderRadius: 8, width: "256px", height: "64px" }}
                >
                    <Typography variant="h6">Update</Typography>
                </Button>
                <Typography variant="body2">
                    You are using the latest version
                </Typography>
            </Grid>
        </Grid>
    );
};

export default NodeActions;
