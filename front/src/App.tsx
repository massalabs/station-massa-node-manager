import * as React from "react";

import { CircularProgress } from "@mui/material";

import Node from "./types/Node";
import NodeStatus from "./types/NodeStatus";
import NodeState from "./types/NodeState";

import Header from "./components/Header";

import Install from "./pages/Install";
import Manager from "./pages/Manager";

import request from "./request";

const getNodeStatus = (): Promise<any> => {
    return request("GET", "http://localhost:8080/node_status", {});
};

const getNodes = (): Promise<any> => {
    return request("GET", "http://localhost:8080/nodes", {});
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
    const [nodeStatus, setNodeStatus] = React.useState<
        { status: NodeStatus | undefined; state: NodeState } | undefined
    >(undefined);

    React.useEffect(() => {
        fetchNodes();
    }, []);

    React.useEffect(() => {
        if (selectedNode) {
            getNodeStatus()
                .then((status) => {
                    console.log(status.data);
                    setNodeStatus(status.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [selectedNode]);

    const selectNode = (node: Node) => {
        setSelectedNode(node);
    };

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
                setSelectedNode={selectNode}
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
                    fetchNodes={fetchNodes}
                />
            ) : (
                <Install fetchNodes={fetchNodes} />
            )}
        </React.Fragment>
    );
}
