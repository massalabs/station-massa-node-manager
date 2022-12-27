import React from "react";

import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";

import NodeStatus from "../../types/NodeStatus";
import Node from "../../types/Node";
import NodeState from "../../types/NodeState";

interface Props {
    selectedNode: Node | undefined;
    nodeStatus:
        | { status: NodeStatus | undefined; state: NodeState }
        | undefined;
}

const ConsensusStatsCard: React.FC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Consensus Stats
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
                            <Typography variant="h6">Total blocks</Typography>
                            <Typography variant="h3">
                                {props.nodeStatus?.status ? (
                                    props.nodeStatus.status.consensus_stats
                                        .stale_block_count +
                                    props.nodeStatus.status.consensus_stats
                                        .final_block_count
                                ) : (
                                    <Skeleton />
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                {props.nodeStatus?.status?.consensus_stats
                                    .stale_block_count ?? <Skeleton />}
                            </Typography>
                            <Typography variant="body2">
                                Stale Blocks
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                {props.nodeStatus?.status?.consensus_stats
                                    .final_block_count ?? <Skeleton />}
                            </Typography>
                            <Typography variant="body2">
                                Final Blocks
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default ConsensusStatsCard;
