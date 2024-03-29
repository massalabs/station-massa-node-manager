import * as React from 'react';
import { CircularProgress } from '@mui/material';
import Node from './types/Node';
import NodeStatus from './types/NodeStatus';
import { NodeMonitor } from './types/NodeMonitor';
import Header from './components/Header';
import Install from './pages/Install';
import Manager from './pages/Manager';
import { localApiGet } from './request';

const getNodeState = async (id: string): Promise<any> => {
  return localApiGet(`node_status?id=${id}`);
};

const getNodes = async (): Promise<any> => {
  return localApiGet('nodes');
};

export default function App() {
  const [isFetchingNodes, setIsFetchingNodes] = React.useState<boolean>(false);
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = React.useState<Node | undefined>(
    (() => {
      if (nodes.length > 0) {
        return nodes[0];
      }
      return undefined;
    })(),
  );

  const [nodeMonitor, setNodeMonitor] = React.useState<NodeMonitor | undefined>(
    undefined,
  );
  const [nodeLogs, setNodeLogs] = React.useState('');

  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetchNodes();
  }, []);

  const getLogs = async (id: string): Promise<any> => {
    if (nodeMonitor?.status && nodeMonitor?.status != 'Unknown') {
      return localApiGet(`node_logs?id=${id}`);
    }
  };

  const fetchMonitoring = () => {
    if (selectedNode) {
      getNodeState(selectedNode.Id)
        .then((state) => {
          setNodeMonitor(state.data);
        })
        .catch((error) => {
          setNodeMonitor({
            metrics: {
              CPU: 0,
              RAM: 0,
              Disk: 0,
            },
            status: 'Down',
            wallet_infos: {
              Address: '',
              Thread: 0,
              Candidate_rolls: 0,
              Final_rolls: 0,
              Active_rolls: 0,
              Final_balance: '0',
              Candidate_balance: '0',
            },
            node_infos: {} as NodeStatus,
          });
          console.error(error);
        });
    }
  };

  const fetchNodeLogs = () => {
    if (selectedNode) {
      getLogs(selectedNode.Id)
        .then((logs) => {
          if (logs?.data) {
            setNodeLogs(logs.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  React.useEffect(() => {
    fetchMonitoring();
    fetchNodeLogs();

    const fetchNodeInt = setInterval(() => {
      fetchNodeLogs();
    }, 30000);

    const monitorInt = setInterval(() => {
      fetchMonitoring();
    }, 2000);

    return () => {
      clearInterval(fetchNodeInt);
      clearInterval(monitorInt);
    };
  }, [selectedNode, nodeMonitor]);

  const fetchNodes = () => {
    setIsFetchingNodes(true);
    getNodes()
      .then((response) => {
        setNodes(response.data);
        if (response.data.length > 0 && !selectedNode) {
          setSelectedNode(response.data[0]);
        }
        setIsFetchingNodes(false);
      })
      .catch((error) => {
        console.error(error);
        setIsFetchingNodes(false);
      });
  };

  return (
    <React.Fragment>
      <Header />

      {isFetchingNodes ? (
        <CircularProgress
          size={128}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : !isUpdating && selectedNode ? (
        <Manager
          selectedNode={selectedNode}
          nodeMonitor={nodeMonitor}
          nodeLogs={nodeLogs}
          fetchMonitoring={fetchMonitoring}
          fetchNodeLogs={fetchNodeLogs}
          forceIsUpdating={setIsUpdating}
          fetchNodes={fetchNodes}
        />
      ) : (
        <Install
          SetNode={setSelectedNode}
          selectedNode={selectedNode}
          isUpdating={isUpdating}
          forceIsUpdating={setIsUpdating}
          fetchNodes={fetchNodes}
        />
      )}
    </React.Fragment>
  );
}
