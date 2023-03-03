import React from "react";
import { TextareaAutosize } from "@mui/base";
import { Card, Typography } from "@mui/material";
import { apiGet } from "../../request";
type Props = {
  fetchNodeLogs: () => Promise<Response>;
  nodeLogs: string | undefined;
};

function LogsCard(props: Props) {

    const exportLogs = () => {

    }
    const handleExportLogs = async () => {
      try {
        const response = await props.fetchNodeLogs();
        const blob = new Blob([await response.text()], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "logs.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error exporting logs:", error);
      }
    };
    return (<>
                  <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
                Logs
            </Typography>
        <Card
            sx={{
                borderRadius: 4,
                maxWidth: 950,
                minHeight: 350,
                maxHeight: 350,
                height: 350,
                width: {
                    xs: "400px",
                    sm: "600px",
                    md: "600px",
                    lg: "800px",
                    xl: "900px",
                },
                backgroundColor: "#172329",
                p: 2,
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    maxWidth: 918,
                    minHeight: 318,
                    maxHeight: 318,
                    height: 318,
                    width: {
                        xs: "368px",
                        sm: "568px",
                        md: "568px",
                        lg: "768px",
                        xl: "868px",
                    },
                    color: "#ffffff",
                    backgroundColor: "#172329",
                    borderRadius: 4,
                }}
            />
        </Card>
            <a onClick={handleExportLogs}>
              Export Logs              
            </a> 
    </>
    );
}

export default LogsCard;
