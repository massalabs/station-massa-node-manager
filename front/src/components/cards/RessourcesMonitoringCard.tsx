import React from "react";

import {
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";

import { HelpOutline } from "@mui/icons-material";

import LinearProgressWithLabel from "../LinearProgressWithLabel";

interface Props {}

const RessourcesMonirotingCard: React.FC<Props> = (_props: Props) => {
    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Ressources monitoring
                <Tooltip title="Those are dummy information.">
                    <IconButton sx={{ p: 0, ml: 1 }}>
                        <HelpOutline fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Typography>
            <Card
                sx={{
                    height: "256px",
                    borderRadius: 4,
                }}
            >
                <CardContent>
                    <Typography variant="h6">
                        CPU
                        <LinearProgressWithLabel value={34} color="success" />
                    </Typography>
                    <Typography variant="h6">
                        RAM
                        <LinearProgressWithLabel value={57} color="success" />
                    </Typography>
                    <Typography variant="h6">
                        Disk
                        <LinearProgressWithLabel value={78} color="warning" />
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default RessourcesMonirotingCard;
