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

const NetworkStatsCard: React.FC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Connections
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
                            <Box sx={{ mx: "auto" }}>
                                <Typography variant="h6">
                                    Total Connections
                                </Typography>
                                <Typography variant="h3">
                                    {props.nodeStatus?.network_stats
                                        ?.active_node_count ?? <Skeleton />}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Grid container>
                                <Grid item xs>
                                    <Typography variant="h6">
                                        {props.nodeStatus?.network_stats
                                            ?.in_connection_count ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Typography variant="body2">
                                        Incoming
                                    </Typography>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid item xs>
                                    <Typography variant="h6">
                                        {props.nodeStatus?.network_stats
                                            ?.out_connection_count ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Typography variant="body2">
                                        Outgoing
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

export default NetworkStatsCard;
