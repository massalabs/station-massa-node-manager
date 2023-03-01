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

import AddressDiplay from "../AddressDisplay";

interface Props {
    selectedNode: Node;
    nodeStatus:NodeStatus | undefined;
}

const NodeInfoCard: React.FC<Props> = (props: Props) => {
    console.log("NodeInfoCard nodeStatus",props.nodeStatus)
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Basic info
            </Typography>
            <Card
                sx={{
                    height: {xs:"450", sm:"350px",md:"350px",lg:"350px",xl:"350px"},
                    borderRadius: 4,
                    overflow: "auto",
                }}
            >
                <CardHeader
                    sx={{
                        pb: 0,
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
                                sx={{ ml: 1, fontWeight: "bold"}}
                            >
                                {props.selectedNode.Id}
                            </Typography>
                            <IconButton>
                                <Edit />
                            </IconButton>
                        </Box>
                    }
                />
                <CardContent>
                    <Grid container spacing={2} sx={{mx:"auto"}}>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                Node info
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Node IP:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.selectedNode.Host}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Node ID:
                                </Typography>
                                {props.nodeStatus ? (
                                    <AddressDiplay
                                        address={
                                            props.nodeStatus?.node_id
                                        }
                                    />
                                ) : (
                                    <Skeleton />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Node Version:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.nodeStatus?.version ?? (
                                        <Skeleton />
                                    )}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                Massa info
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Current Cycle:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.nodeStatus
                                        ?.current_cycle ?? <Skeleton />}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Current Period:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        width: "50%",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus
                                            ?.execution_stats?.active_cursor
                                            .period ?? <Skeleton />}
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
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Current Thread:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        width: "50%",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus
                                            ?.execution_stats?.active_cursor
                                            .thread ?? <Skeleton />}
                                    </Typography>
                                    <Tooltip title="The Massa blockchain is divided in 32 Threads that are running in parallel.">
                                        <IconButton sx={{ p: 0, ml: 1 }}>
                                            <HelpOutline fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item sx={{direction: "row"}} xs={12} sm={6} md={6}>
                            <Typography variant="h6">
                                Stacking info
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Wallet Nickname:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.nodeStatus
                                        ?.current_cycle ?? <Skeleton />}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Wallet Balance:
                                </Typography>
                                <Typography variant="subtitle2">
                                    {props.nodeStatus
                                        ?.current_cycle ?? <Skeleton />}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Rolls Balance:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        width: "50%",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus
                                            ?.execution_stats?.active_cursor
                                            .period ?? <Skeleton />}
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
                                }}
                            >
                                <Typography variant="subtitle2" width="50%">
                                    Stacking Address:
                                </Typography>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        width: "50%",
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        {props.nodeStatus
                                            ?.execution_stats?.active_cursor
                                            .thread ?? <Skeleton />}
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
