import React from 'react';
import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  Container,
} from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { apiPost, localApiPost } from '../request';

interface Props {
  fetchNodes: () => void;
}

const Install: React.FC<Props> = (props: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState('');
  const [host, setHost] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUser] = React.useState('');
  const [discordId, setDiscord] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const installNode = () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('id', name);
    formData.append('host', host);
    formData.append('username', username);
    formData.append('wallet-password', password);
    formData.append('discord-id', discordId);
    formData.append('file', selectedFile);

    localApiPost(`install`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setIsLoading(false);
        props.fetchNodes();
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleFileSelect = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];
      setSelectedFile(file);
    }
  };

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        justifyContent: 'center',
      }}
    >
      <TextField
        required
        sx={{ marginTop: '8px' }}
        label="Node Name"
        id="name"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        required
        sx={{ marginTop: '8px' }}
        label="Host IP"
        id="host"
        onChange={(e) => setHost(e.target.value)}
      />
      <TextField
        required
        sx={{ marginTop: '8px' }}
        label="Wallet password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        required
        sx={{ marginTop: '8px' }}
        label="SSH user"
        id="username"
        onChange={(e) => setUser(e.target.value)}
      />
      <TextField
        required
        sx={{ marginTop: '8px' }}
        label="Discord token"
        id="discordId"
        onChange={(e) => setDiscord(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{
          padding: '16px 24px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          textTransform: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1976d2',
            borderColor: '#1976d2',
          },
          marginTop: '16px',
        }}
        startIcon={<CloudUploadIcon />}
      >
        {selectedFile ? selectedFile.name : 'Select SSH private key file'}
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={installNode}
        sx={{
          borderRadius: 8,
          width: '65%',
          height: '96px',
          marginTop: '16px',
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h6">Setup your node</Typography>
        )}
      </Button>

      <Typography variant="overline">
        By clicking the button above, you will install a node on your server.
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
