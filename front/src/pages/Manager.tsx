import React from 'react';

import { Container, Grid } from '@mui/material';

import ConsensusStatsCard from '../components/cards/ConsensusStatsCard';
import NetworkStatsCard from '../components/cards/NetworkStatsCard';
import NodeInfoCard from '../components/cards/NodeInfoCard';
import NodeStatusCard from '../components/cards/NodeStatusCard';
import RessourcesMonirotingCard from '../components/cards/RessourcesMonitoringCard';

import NodeActions from '../components/NodeActions';

import { NodeMonitor } from '../types/NodeMonitor';
import NodeStatus from '../types/NodeStatus';
import Node from '../types/Node';
import NodeStakingInfoCard from '../components/cards/NodeStakingInfoCard';
import LogsCard from '../components/cards/LogsCard';

interface Props {
  selectedNode: Node;
  nodeMonitor: NodeMonitor | undefined;
  nodeLogs: string;
  fetchMonitoring: () => any;
  fetchNodeLogs: () => any;
  switchIsUpdating: () => any;
  fetchNodes: () => any;
}

const Manager: React.FC<Props> = (props: Props) => {
  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <NodeActions
        nodeMonitor={props.nodeMonitor}
        selectedNode={props.selectedNode}
        fetchMonitoring={props.fetchMonitoring}
        switchIsUpdating={props.switchIsUpdating}
        fetchNodes={props.fetchNodes}
      />
      <Grid container spacing={4} sx={{ mt: '8px' }}>
        <Grid item xs={12} sm={6} md={6} lg={2} xl={1.5}>
          <NodeStatusCard nodeMonitor={props.nodeMonitor} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3.9} xl={3.9}>
          <NodeInfoCard
            selectedNode={props.selectedNode}
            nodeMonitor={props.nodeMonitor}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <RessourcesMonirotingCard nodeMonitor={props.nodeMonitor} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <NodeStakingInfoCard
            nodeMonitor={props.nodeMonitor}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8.9}
          xl={8.4}
          sx={{ pl: 4, pt: 4 }}
        >
          <LogsCard
            fetchNodeLogs={props.fetchNodeLogs}
            nodeLogs={props.nodeLogs}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3.5} lg={3} xl={3}>
          <ConsensusStatsCard
            selectedNode={props.selectedNode}
            nodeStatus={props.nodeMonitor?.node_infos}
          />
          <NetworkStatsCard
            selectedNode={props.selectedNode}
            nodeStatus={props.nodeMonitor?.node_infos}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Manager;
