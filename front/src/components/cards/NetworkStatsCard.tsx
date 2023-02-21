import React from "react";

import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";

import NodeStatus from "../../types/NodeStatus";
import Node from "../../types/Node";

interface Props {
    selectedNode: Node | undefined;
    nodeStatus: NodeStatus | undefined;
}

const NetworkStatsCard: React.FC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Connections
            </Typography>
            <Card
                sx={{
                    height: "256px",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CardContent sx={{ textAlign: "center" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h3">
                                {props.nodeStatus?.network_stats?.active_node_count ?? <Skeleton />}

                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                {props.nodeStatus?.network_stats?.in_connection_count ?? <Skeleton />}

                            </Typography>
                            <Typography variant="body2">Incoming</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                {props.nodeStatus?.network_stats?.out_connection_count ?? <Skeleton />}

                            </Typography>
                            <Typography variant="body2">Outgoing</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default NetworkStatsCard;
