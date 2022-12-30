import React from "react";

import { Button, CircularProgress, Container, Typography } from "@mui/material";

import request from "../request";

const installNodeRequest = (name: string): Promise<any> => {
    return request("POST", "http://localhost:8080/install", { name });
};

interface Props {
    fetchNodes: () => void;
}

const Install: React.FC<Props> = (props: Props) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const installNode = () => {
        setIsLoading(true);
        installNodeRequest("Local Node")
            .then((response) => {
                setIsLoading(false);
                props.fetchNodes();
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "calc(100vh - 64px)",
                justifyContent: "center",
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={installNode}
                sx={{ borderRadius: 8, width: "65%", height: "96px" }}
            >
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Typography variant="h6">Install a local node</Typography>
                )}
            </Button>
            <Typography variant="overline">
                By clicking the button above, you will install a local node.
            </Typography>

            <Typography variant="h5" sx={{ mt: 4 }}>
                A new area begins here.
            </Typography>
            <Typography variant="h5">
                Forget about complex installation instructions.
            </Typography>
            <Typography variant="h5">
                Install, run and manager your node with a single click !
            </Typography>
        </Container>
    );
};

export default Install;
