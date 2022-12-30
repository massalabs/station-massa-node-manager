import * as React from "react";

import { Box, IconButton, Skeleton, Typography } from "@mui/material";

import { ContentCopy } from "@mui/icons-material";

interface Props {
    address: string | undefined;
}

const AddressDiplay: React.FC<Props> = (props: Props) => {
    const formatNodeID = (id: string) => {
        return id.substring(0, 4) + "..." + id.substring(id.length - 4);
    };

    return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <Typography variant="h6">
                {props.address ? formatNodeID(props.address) : <Skeleton />}
            </Typography>
            {props.address && (
                <IconButton
                    sx={{ p: 0, ml: 1 }}
                    onClick={() => {
                        navigator.clipboard.writeText(props.address || "");
                    }}
                >
                    <ContentCopy />
                </IconButton>
            )}
        </Box>
    );
};

export default AddressDiplay;
