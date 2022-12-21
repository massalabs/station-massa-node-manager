import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import NodeStatus from "../types/NodeStatus";
import NodeState from "../types/NodeState";
import request from "../request";

const startNodeRequest = (): Promise<any> => {
    return request("POST", "http://localhost:8080/start_node", {});
};

const stopNodeRequest = (): Promise<any> => {
    return request("POST", "http://localhost:8080/stop_node", {});
};

interface Props {
    nodeStatus:
        | { status: NodeStatus | undefined; state: NodeState }
        | undefined;
}

const NodeActions: React.FC<Props> = (props: Props) => {
    const handleStart = () => {
        if (props.nodeStatus?.state === "STOPPED") {
            startNodeRequest()
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleStop = () => {
        if (props.nodeStatus?.state !== "STOPPED") {
            stopNodeRequest()
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
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
                    <Typography variant="h6">Start</Typography>
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
                    <Typography variant="h6">Stop</Typography>
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
