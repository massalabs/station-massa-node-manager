import * as React from "react";

import { CircularProgress } from "@mui/material";

import Node from "./types/Node";
import NodeStatus, { getStateStr } from "./types/NodeStatus";

import Header from "./components/Header";

import Install from "./pages/Install";
import Manager from "./pages/Manager";

import { localApiGet, request } from "./request";

const getStatusFromNodeApi = async (host: string): Promise<any> => {
    const res = await request("POST", `http://${host}:33035/api/v2`, {
        jsonrpc: "2.0",
        id: 1,
        method: "get_status",
        params: []
    })
    console.log("getStatusFromNodeApi", res)
    console.log("getStatusFromNodeApi", res.data.result)
    return res;
};

const getNodeState = async (id: string): Promise<any> => {
    return localApiGet(`node_status?id=${id}`)
};

const getNodes = async (): Promise<any> => {
    return localApiGet("nodes");
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
    const [nodeSshStatus, setNodeSshStatus] = React.useState<string>("");

    React.useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodeStatus = () => {
        if (selectedNode) {
            getStatusFromNodeApi(selectedNode.Host)
                .then((status) => {
                    console.log("setNodeStatus", status.data.result)
                    setNodeStatus(status.data.result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const fetchSshStatus = () => {
        console.log("selectedNode??",selectedNode)
        if (selectedNode) {
            getNodeState(selectedNode.Id).then((state) => {
                console.log("fetchSshStatus state", state, getStateStr(state))
                setNodeSshStatus(state.data.status);
            })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    React.useEffect(() => fetchNodeStatus(), [selectedNode]);
    React.useEffect(() => fetchSshStatus(), [selectedNode]);

    const fetchNodes = () => {
        setIsFetchingNodes(true);
        getNodes()
            .then((response) => {
                console.log(response.data);
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
                    nodeSshStatus={nodeSshStatus}
                    fetchNodeStatus={fetchNodeStatus}
                    fetchNodeSshStatus={fetchSshStatus}
                />
            ) : (
                <Install fetchNodes={fetchNodes} />
            )}
        </React.Fragment>
    );
}
