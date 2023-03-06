import * as React from "react";

import { CircularProgress } from "@mui/material";

import Node from "./types/Node";
import NodeStatus from "./types/NodeStatus";
import { NodeMonitor } from "./types/NodeMonitor";

import Header from "./components/Header";

import Install from "./pages/Install";
import Manager from "./pages/Manager";

import { apiPost, localApiGet, nodeApiPost, request } from "./request";

const getStatusFromNodeApi = (host: string): Promise<any> => {
    return  nodeApiPost(`http://${host}:33035/api/v2`, {    
        jsonrpc: "2.0",
        id: 1,
        method: "get_status",
        params: []
    })
};

const getNodeState = async (id: string): Promise<any> => {
    return localApiGet(`node_status?id=${id}`)
};

const getNodes = async (): Promise<any> => {
    return localApiGet("nodes");
};

const getLogs = async (id: string): Promise<any> => {
    return localApiGet(`node_logs?id=${id}`);
};

export default function App() {
    const [isFetchingNodes, setIsFetchingNodes] =
        React.useState<boolean>(false);
    const [nodes, setNodes] = React.useState<Node[]>([]);
    const [selectedNode, setSelectedNode] = React.useState<Node | undefined>(
        (() => {
            if (nodes.length > 0) {
                return nodes[0];
            }
            return undefined;
        })()
    );

    const [nodeStatus, setNodeStatus] = React.useState<NodeStatus | undefined>(undefined);
    const [nodeMonitor, setNodeMonitor] = React.useState<NodeMonitor | undefined>(undefined);
    const [nodeLogs, setNodeLogs] = React.useState("");

    React.useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodeStatus = () => {
        if (selectedNode) {
            getStatusFromNodeApi(selectedNode.Host)
                .then((status) => {
                    setNodeStatus(status.data.result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const fetchMonitoring = () => {
        if (selectedNode) {
            getNodeState(selectedNode.Id).then((state) => {
                setNodeMonitor(state.data);
            })
            .catch((error) => {
                setNodeMonitor({
                    metrics: {
                        CPU: 0,
                        RAM: 0,
                        Disk: 0
                    },
                    status: "Down",
                    wallet_infos: {
                        Thread: 0,
                        Candidate_rolls: 0,
                        Final_rolls: 0,
                        Active_rolls: 0,
                        Final_balance: "0",
                        Candidate_balance: "0"
                    }
                });
                console.error(error);
            });
        }
    };

    const fetchNodeLogs = () => {
        if (selectedNode) {
            getLogs(selectedNode.Id).then((logs) => {
                setNodeLogs(logs.data)
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };

    React.useEffect(() => fetchNodeStatus(), [selectedNode]);

    React.useEffect(() => {
        fetchMonitoring();
        fetchNodeLogs();
        // Fetch data every 5 seconds
        const intervalId = setInterval(() => {
            fetchMonitoring();
            fetchNodeLogs();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [selectedNode]);

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
            <Header
                nodes={nodes}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
            />

            {isFetchingNodes ? (
                <CircularProgress
                    size={128}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ) : selectedNode ? (
                <Manager
                    selectedNode={selectedNode}
                    nodeStatus={nodeStatus}
                    nodeMonitor={nodeMonitor}
                    nodeLogs={nodeLogs}
                    fetchNodeStatus={fetchNodeStatus}
                    fetchMonitoring={fetchMonitoring}
                    fetchNodeLogs={fetchNodeLogs}
                />
            ) : (
                <Install fetchNodes={fetchNodes} />
            )}
        </React.Fragment>
    );
}
