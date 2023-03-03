import React from "react";

import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Skeleton,
    Tooltip,
    Typography,
} from "@mui/material";
import { Edit, HelpOutline } from "@mui/icons-material";

import Node from "../../types/Node";
import NodeStatus from "../../types/NodeStatus";
import { NodeMonitor } from "../../types/NodeMonitor";

import AddressDisplay from "../AddressDisplay";

interface Props {
    selectedNode: Node;
    nodeStatus: NodeStatus | undefined;
    nodeMonitor: NodeMonitor | undefined;
}

const NodeInfoCard: React.FC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Basics
            </Typography>
            <Card
                sx={{
                    height: {
                        xs: "300px",
                        sm: "200px",
                    },
                    borderRadius: 4,
                    overflow: "auto",
                    p: 2,
                }}
            >
                <CardHeader
                    sx={{
                        p: 0,
                    }}
                    title={
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Typography variant="h6">Node name:</Typography>
                            <Typography
                                variant="h6"
                                sx={{ ml: 1, fontWeight: "bold" }}
                            >
                                {props.selectedNode.Id}
                            </Typography>
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </Box>
                    }
                />
                <CardContent sx={{ p: 0, justifyItems: "center" }}>
                    <Grid
                        container
                        spacing={0}
                        sx={{ p: 0, justifyContent: "space-between" }}
                    >
                        <Grid item xs={12} sm={4.5} md={4.5}>
                            <Typography variant="h6">Node info</Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="40%">
                                    IP:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.selectedNode.Host}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="40%">
                                    ID:
                                </Typography>

                                {props.nodeStatus ? (
                                    <div style={{}}>
                                        <AddressDisplay
                                            address={props.nodeStatus?.node_id}
                                        />
                                    </div>
                                ) : (
                                    <Skeleton />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="40%">
                                    Version:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.nodeStatus?.version ?? <Skeleton />}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4.5} md={4.5} sx={{ ml: 0 }}>
                            <Typography variant="h6" sx={{ width: "auto" }}>
                                Massa info
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="auto">
                                    Cycle:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus?.current_cycle ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The period is the time between two slots of a same thread. It is approximately 16 seconds.">
                                        <IconButton sx={{ p: 0, ml: 1 }}>
                                            <HelpOutline fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="auto">
                                    Period:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus?.execution_stats
                                            ?.active_cursor.period ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The period is the time between two slots of a same thread. It is approximately 16 seconds.">
                                        <IconButton sx={{ p: 0, ml: 1 }}>
                                            <HelpOutline fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="subtitle2" width="35%">
                                    Thread:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus?.execution_stats
                                            ?.active_cursor.thread ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The Massa blockchain is divided in 32 Threads that are running in parallel.">
                                        <IconButton sx={{ p: 0, ml: 1 }}>
                                            <HelpOutline fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default NodeInfoCard;
