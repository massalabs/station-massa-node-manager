import { HelpOutline } from "@mui/icons-material";
import {
    Grid,
    Typography,
    Box,
    Skeleton,
    Tooltip,
    IconButton,
    CardContent,
    Card,
} from "@mui/material";
import React from "react";
import { NodeMonitor } from "../../types/NodeMonitor";
import NodeStatus from "../../types/NodeStatus";
import wallet from "../../assets/wallet.svg";
import coins from "../../assets/coins.svg";
import coinsSwap from "../../assets/coins-swap.svg";
type Props = {
    nodeStatus: NodeStatus | undefined;
    nodeMonitor: NodeMonitor | undefined;
};
const NodeStakingInfoCard = (props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Stacking
            </Typography>
            <Card
                sx={{
                    height: "200px",
                    borderRadius: 4,
                    overflow: "auto",
                    
                }}
            >
                <CardContent>
                    <Grid container sx={{ mx: "0" }}>
                        <Grid
                            item
                            sx={{
                                direction: "row",
                                justifyItems: "center",
                                justifyContent: "center",
                            }}
                            xs={12}
                            sm={6}
                            md={12}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        width: "100%",
                                        
                                    }}
                                >
                                    <img
                                        src={wallet}
                                        width="40"
                                        alt="React Logo"
                                        style={{ marginLeft: 3 }}
                                    />
                                    <Typography variant="subtitle2" width="30%" marginLeft={3}>
                                        Wallet Balance:
                                    </Typography>
                                    
                                    <Typography
                                        variant="h6"
                                        marginLeft={5}
                                    >
                                        {props.nodeMonitor?.wallet_infos
                                            ?.Final_balance ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The actual balance of your wallet">
                                        <IconButton sx={{ p: 0, ml: 5 }}>
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
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        width: "100%",
                                        marginTop: 2,
                                    }}  
                                >
                                    <img
                                        src={coinsSwap}
                                        width="40"
                                        alt="React Logo"
                                        style={{ marginLeft: 3 }}
                                    />
                                    <Typography variant="subtitle2" width="30%" marginLeft={3}>
                                        Active Rolls:
                                    </Typography>
                                    
                                    <Typography
                                        variant="h6"
                                        marginLeft={5}
                                    >
                                        {props.nodeMonitor?.wallet_infos
                                            ?.Active_rolls ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The current active rolls">
                                        <IconButton sx={{ p: 0, ml: 5 }}>
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
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        width: "100%",
                                        marginTop: 2,
                                    }}
                                >
                                    <img
                                        src={coins}
                                        width="40"
                                        alt="React Logo"
                                        style={{ marginLeft: 3 }}
                                    />
                                    <Typography variant="subtitle2" width="30%" marginLeft={3}>
                                        Balance Rolls:
                                    </Typography>
                                    
                                    <Typography
                                        variant="h6"
                                        marginLeft={5}
                                    >
                                        {props.nodeMonitor?.wallet_infos
                                            ?.Final_rolls ?? (
                                            <Skeleton />
                                        )}
                                    </Typography>
                                    <Tooltip title="The balance of your Rolls">
                                        <IconButton sx={{ p: 0, ml: 5 }}>
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

export default NodeStakingInfoCard;
