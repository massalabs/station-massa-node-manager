import React from 'react';
import { TextareaAutosize } from '@mui/base';
import { Button, Card, Typography } from '@mui/material';
import { apiGet } from '../../request';
import { Scrollbar } from 'react-scrollbars-custom';
import { downloadFile } from '../../utils/shared';
type Props = {
  fetchNodeLogs: () => Promise<Response>;
  nodeLogs: string;
};

function LogsCard(props: Props) {
  const handleExportLogs = async () => {
    return downloadFile(props.nodeLogs, 'logs.txt', 'Error exporting logs:');
  };
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
