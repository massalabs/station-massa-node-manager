import React from "react";
import { TextareaAutosize } from "@mui/base";
import { Button, Card, Typography } from "@mui/material";
import { apiGet } from "../../request";
import { Scrollbar } from 'react-scrollbars-custom';
type Props = {
  fetchNodeLogs: () => Promise<Response>;
  nodeLogs: string;
};

function LogsCard(props: Props) {

  const handleExportLogs = async () => {
    try {
      const blob = new Blob([props.nodeLogs], { type: "text/plain" });
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
                minHeight: 350,
                maxHeight: 350,
                height: 350,
                width: "auto",
                backgroundColor: "#172329",
                p: 2,
            }}
        >
          <Scrollbar style={{}}>

            <Typography
                variant="body2"
                sx={{
                    color: "#ffffff",
                    borderRadius: 2,
                    whiteSpace: "pre-wrap",
                }}
            >
                {props.nodeLogs}
            </Typography>
                </Scrollbar>
        </Card>
            <Button onClick={handleExportLogs}>
              Export Logs              
            </Button> 
    </>
    );
}

export default LogsCard;
