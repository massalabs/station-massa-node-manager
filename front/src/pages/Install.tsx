import React from "react";
import { Button, Container, Typography } from "@mui/material";
import request from "../request";

const installNodeRequest = (name: string): Promise<any> => {
    return request("POST", "http://localhost:8080/install", { name });
};

interface Props {}

const Install: React.FC<Props> = (_props: Props) => {
    const [ isLoading, setIsLoading ] = React.useState<boolean>(false);
    const [ error, setError ] = React.useState<string | undefined>(undefined);

    const installNode = () => {
        setIsLoading(true);
        installNodeRequest("Local Node").then((response) => {
            setIsLoading(false);
        }).catch((error) => {
            setError(error);
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
                <Typography variant="h6">Install a local node</Typography>
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
