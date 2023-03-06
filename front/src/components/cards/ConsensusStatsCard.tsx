import React from "react";

import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Skeleton,
    Typography,
} from "@mui/material";

import NodeStatus from "../../types/NodeStatus";
import Node from "../../types/Node";

interface Props {
    selectedNode: Node | undefined;
    nodeStatus: NodeStatus | undefined;
}

const ConsensusStatsCard: React.FC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Consensus
            </Typography>
            <Card
                sx={{
                    height: "160px",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CardContent sx={{ textAlign: "center" }}>
                    <Grid container spacing={0}>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            sx={{
                                display: "flex",
                                direction: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{mx:"auto"}}>
                                <Typography variant="h6">
                                    Total blocks
                                </Typography>
                                <Typography variant="h3">
                                    {props.nodeStatus ? (
                                        props.nodeStatus?.consensus_stats
                                            ?.stale_block_count +
                                        props.nodeStatus?.consensus_stats
                                            ?.final_block_count
                                    ) : (
                                        <Skeleton />
                                    )}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Grid container>
                                <Grid item xs>
                                    <Typography variant="h6">
                                        {props.nodeStatus?.consensus_stats
                                            ?.stale_block_count ?? <Skeleton />}
                                    </Typography>
                                    <Typography variant="body2">
                                        Stale Blocks
                                    </Typography>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid item xs>
                                    <Typography variant="h6">
                                        {props.nodeStatus?.consensus_stats
                                            ?.final_block_count ?? <Skeleton />}
                                    </Typography>
                                    <Typography variant="body2">
                                        Final Blocks
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default ConsensusStatsCard;
