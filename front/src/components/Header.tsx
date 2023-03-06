import React from "react";

import { AppBar, Toolbar, Typography } from "@mui/material";

import Node from "../types/Node";

interface Props {
    nodes: Node[];
    selectedNode?: Node;
    setSelectedNode: (node: Node) => void;
}

const Header: React.FC<Props> = (props: Props) => {
    return (
        <AppBar position="static" color="transparent">
            <Toolbar style={{ paddingLeft: 0 }}>
                <img src="logo.svg" alt="logo" height="64px" />
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    Node Manager
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
