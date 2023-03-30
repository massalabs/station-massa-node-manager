import React from 'react';
import { Button, Card, Typography } from '@mui/material';
import { Scrollbar } from 'react-scrollbars-custom';
import { saveAs } from "file-saver";

type Props = {
  nodeLogs: string;
};

function LogsCard(props: Props) {
  const handleExportLogs = async () => saveAs(new Blob([props.nodeLogs], { type: 'plain/text' }), 'logs.txt')

  return (
    <>
      <Typography variant="subtitle2" sx={{ ml: 2, mt: 1 }}>
        Logs
      </Typography>
      <Card
        sx={{
          borderRadius: 4,
          minHeight: 350,
          maxHeight: 350,
          height: 350,
          width: 'auto',
          backgroundColor: '#172329',
          p: 2,
        }}
      >
        <Scrollbar style={{}}>
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff',
              borderRadius: 2,
              whiteSpace: 'pre-wrap',
            }}
          >
            {props.nodeLogs}
          </Typography>
        </Scrollbar>
      </Card>
      <Button onClick={handleExportLogs}>Export Logs</Button>
    </>
  );
}

export default LogsCard;
