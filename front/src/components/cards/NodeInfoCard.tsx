import React from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Skeleton,
    Typography,
} from "@mui/material";

import Node from "../../types/Node";
import NodeStatus from "../../types/NodeStatus";
import NodeState from "../../types/NodeState";

interface Props {
    selectedNode: Node;
    nodeStatus:
        | { status: NodeStatus | undefined; state: NodeState }
        | undefined;
}

const NodeInfoCard: React.FC<Props> = (props: Props) => {
    const formatNodeID = (id: string | undefined) => {
        if (!id) {
            return "";
        }
        return id.substring(0, 4) + "..." + id.substring(id.length - 4);
    };

    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Info
            </Typography>
            <Card
                sx={{
                    height: "256px",
                    borderRadius: 4,
                    overflow: "auto",

                }}
            >
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="subtitle2">
                                Node info
                            </Typography>
                            <Typography variant="h6">
                                Node name: {props.selectedNode.nodeName}
                            </Typography>
                            <Typography variant="h6">
                                Node IP: {props.selectedNode.ip}
                            </Typography>
                            <Typography variant="h6">
                                Node ID:{" "}
                                {formatNodeID(
                                    props.nodeStatus?.status?.node_id
                                ) ?? <Skeleton />}
                            </Typography>
                            <Typography variant="h6">
                                Node Version:{" "}
                                {props.nodeStatus?.status?.version ?? (
                                    <Skeleton />
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="subtitle2">
                                Massa info
                            </Typography>
                            <Typography variant="h6">
                                Current Cycle:{" "}
                                {props.nodeStatus?.status?.current_cycle ?? (
                                    <Skeleton />
                                )}
                            </Typography>
                            <Typography variant="h6">
                                Current Period:{" "}
                                {props.nodeStatus?.status?.execution_stats
                                    .active_cursor.period ?? <Skeleton />}
                            </Typography>
                            <Typography variant="h6">
                                Current Thread:{" "}
                                {props.nodeStatus?.status?.execution_stats
                                    .active_cursor.thread ?? <Skeleton />}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default NodeInfoCard;
