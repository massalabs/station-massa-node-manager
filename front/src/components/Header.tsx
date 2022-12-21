import {
    AppBar,
    Button,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";
import Node from "../types/Node";

interface Props {
    nodes: Node[];
    selectedNode?: Node;
    setSelectedNode: (node: Node) => void;
}

const Header: React.FC<Props> = (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (props.nodes.length === 0) {
            console.log("ADD NODE");
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectNode = (node: Node) => {
        props.setSelectedNode(node);
        handleClose();
    };

    return (
        <AppBar position="static" color="transparent">
            <Toolbar style={{ paddingLeft: 0 }}>
                <img src="logo.svg" alt="logo" height="64px" />
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    Node Manager
                </Typography>
                {/* <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClick}
                    sx={{ borderRadius: "16px", minWidth: "96px" }}
                >
                    {props.selectedNode ? props.selectedNode.nodeName : "Select Node"}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {props.nodes.map((node) => (
                        <MenuItem
                            key={node.nodeName}
                            onClick={() => selectNode(node)}
                        >
                            {node.nodeName}
                        </MenuItem>
                    ))}
                    <MenuItem onClick={handleClose}>Add Node</MenuItem>
                </Menu>
                 */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
