import React from "react";

import { Button, CircularProgress, Grid, Typography } from "@mui/material";

import NodeStatus from "../types/NodeStatus";
import NodeState from "../types/NodeState";
import Node from "../types/Node";

import {request} from "../request";

const startNodeRequest = (id: string): Promise<any> => {
    return request(
        "POST",
        `start_node?id=${id}`,
        {}
    );
};

const stopNodeRequest = (id: string): Promise<any> => {
    return request(
        "POST",
        `stop_node?id=${id}`,
        {}
    );
};

interface Props {
    nodeStatus:
        | { status: NodeStatus | undefined; state: string }
        | undefined;
    fetchNodeStatus: (host: string) => any;
    selectedNode: Node;
}

const NodeActions: React.FC<Props> = (props: Props) => {
    const [isStartingNode, setIsStartingNode] = React.useState<boolean>(false);
    const [isStoppingNode, setIsStoppingNode] = React.useState<boolean>(false);

    const handleStart = () => {
        if (props.nodeStatus?.state === "STOPPED") {
            setIsStartingNode(true);
            startNodeRequest(props.selectedNode.Id)
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsStartingNode(false);
                    props.fetchNodeStatus(props.selectedNode.Host);
                });
        }
    };

    const handleStop = () => {
        if (props.nodeStatus?.state !== "STOPPED") {
            setIsStoppingNode(true);
            stopNodeRequest(props.selectedNode.Id)
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setIsStoppingNode(false);
                    props.fetchNodeStatus(props.selectedNode.Host);
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
