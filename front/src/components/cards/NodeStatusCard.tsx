import React from "react";

import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Skeleton,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

import NodeState from "../../types/NodeState";
import NodeStatus from "../../types/NodeStatus";

interface Props {
    nodeStatus:
        | { status: NodeStatus | undefined; state: NodeState }
        | undefined;
}

const NodeStatusCard: React.FC<Props> = (props: Props) => {
    const getStatusColor = (status: NodeState | undefined) => {
        switch (status) {
            case "RUNNING":
                return "green";
            case "STOPPED":
                return "error";
            default:
                return "yellow";
        }
    };

    const getStatusIcon = (status: NodeState | undefined) => {
        switch (status) {
            case "RUNNING":
                return (
                    <CheckCircleIcon sx={{ fontSize: 64 }} color="success" />
                );
            case "STOPPED":
                return <CancelIcon sx={{ fontSize: 64 }} color="error" />;
            case "BOOTSTRAPING":
                return <PendingIcon sx={{ fontSize: 64 }} color="warning" />;
            default:
                return <HelpIcon sx={{ fontSize: 64 }} />;
        }
    };

    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Status
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
                    {getStatusIcon(props.nodeStatus?.state)}
                    <Typography
                        variant="h4"
                        color={getStatusColor(props.nodeStatus?.state)}
                    >
                        {props.nodeStatus?.state ?? <Skeleton />}
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    );
};

export default NodeStatusCard;
