import React from "react";

import { Container, Grid } from "@mui/material";

import ConsensusStatsCard from "../components/cards/ConsensusStatsCard";
import NetworkStatsCard from "../components/cards/NetworkStatsCard";
import NodeInfoCard from "../components/cards/NodeInfoCard";
import NodeStatusCard from "../components/cards/NodeStatusCard";
import RessourcesMonirotingCard from "../components/cards/RessourcesMonitoringCard";

import NodeActions from "../components/NodeActions";

import NodeState from "../types/NodeState";
import NodeStatus from "../types/NodeStatus";
import Node from "../types/Node";

interface Props {
    selectedNode: Node;
    nodeStatus: NodeStatus | undefined;
    nodeSshStatus: string
    fetchNodeStatus: () => any;
    fetchNodeSshStatus: () => any;
}

const Manager: React.FC<Props> = (props: Props) => {
    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <NodeActions
                nodeStatus={props.nodeStatus}
                nodeSshStatus={props.nodeSshStatus}
                selectedNode={props.selectedNode}
                fetchNodeStatus={props.fetchNodeStatus}
                fetchNodeSshStatus={props.fetchNodeSshStatus}
            />
            <Grid container spacing={4} sx={{ mt: "8px" }}>
                <Grid item xs={12} sm={12} md={8}>
                    <NodeInfoCard
                        selectedNode={props.selectedNode}
                        nodeStatus={props.nodeStatus}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <NodeStatusCard nodeSshStatus={props.nodeSshStatus} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <NetworkStatsCard
                        selectedNode={props.selectedNode}
                        nodeStatus={props.nodeStatus}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <RessourcesMonirotingCard />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <ConsensusStatsCard
                        selectedNode={props.selectedNode}
                        nodeStatus={props.nodeStatus}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Manager;
