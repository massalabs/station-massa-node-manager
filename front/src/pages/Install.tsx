import React from 'react';

import {
  Button,
  TextField,
  CircularProgress,
  Typography,
  Container,
  Link,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { localApiPost } from '../request';
import Node from '../types/Node';

interface Props {
  SetNode: (node: Node) => void;
  selectedNode: Node | undefined;
  isUpdating: boolean;
  forceIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  fetchNodes: () => any;
}

const Install: React.FC<Props> = (props: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState(props.selectedNode?.Id ?? '');
  const [host, setHost] = React.useState(props.selectedNode?.Host ?? '');
  const [password, setPassword] = React.useState(
    props.selectedNode?.WalletPassword ?? '',
  );
  const [sshPassword, setSshPassword] = React.useState(
    props.selectedNode?.SshPassword ?? '',
  );
  const [username, setUser] = React.useState(
    props.selectedNode?.Username ?? '',
  );
  const [discordId, setDiscord] = React.useState(
    props.selectedNode?.DiscordId ?? '',
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [sshType, setSshType] = React.useState(
    props.selectedNode && props.selectedNode?.SshPassword != ''
      ? 'password'
      : 'key',
  );

  const installNode = () => {
    setIsLoading(true);

    const sshPwd = sshType === 'key' ? '' : sshPassword;
    const formData = new FormData();
    formData.append('id', name);
    formData.append('host', host);
    formData.append('username', username);
    formData.append('wallet-password', password);
    formData.append('ssh-password', sshPwd);
    formData.append('discord-id', discordId);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const newNode: Node = {
      Id: name,
      Host: host,
      Username: username,
      WalletPassword: password,
      SshPassword: sshPwd,
      DiscordId: discordId,
      Status: 'Installing',
    };
    props.SetNode(newNode);

    localApiPost(
      props.isUpdating ? `install?update=` + props.selectedNode?.Id : `install`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
      .then((response) => {
        setIsLoading(false);
        if (props.isUpdating) {
          props.forceIsUpdating(false);
        }
        const newNode: Node = {
          Id: name,
          Host: host,
          Username: username,
          WalletPassword: password,
          SshPassword: sshPassword,
          DiscordId: discordId,
          Status: 'Installing',
        };
        props.SetNode(newNode);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        props.fetchNodes();
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
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4">
        Install and manage your node in 1-click.
      </Typography>
      <Typography variant="h5" sx={{ mb: '16px' }}>
        You simply need a{' '}
        <Link
          underline="hover"
          href="https://github.com/massalabs/station-massa-node-manager/wiki/Get-your-VPS"
        >
          <b>server</b>
        </Link>{' '}
        and you can start.
      </Typography>
      <TextField
        required
        sx={{ mt: '8px' }}
        label="Node nickname"
        id="name"
        onChange={(e) => setName(e.target.value)}
        defaultValue={props.selectedNode?.Id}
      />
      <TextField
        required
        sx={{ mt: '8px' }}
        label="Server IP"
        id="host"
        onChange={(e) => setHost(e.target.value)}
        defaultValue={props.selectedNode?.Host}
      />
      <Tooltip title="A wallet will be created for staking purposes. Define password of your choice.">
        <TextField
          required
          sx={{ mt: '8px' }}
          label="Wallet password"
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          defaultValue={props.selectedNode?.WalletPassword}
        />
      </Tooltip>
      <Tooltip title="This token is used to log into your Discord account. Add it if you want to participate to Massa Testnet reward program.">
        <TextField
          sx={{ mt: '8px' }}
          label="Discord token"
          id="discordId"
          onChange={(e) => setDiscord(e.target.value)}
          defaultValue={props.selectedNode?.DiscordId}
        />
      </Tooltip>
      <TextField
        required
        sx={{ mt: '8px' }}
        label="SSH user"
        id="username"
        onChange={(e) => setUser(e.target.value)}
        defaultValue={props.selectedNode?.Username}
      />
      <FormControl component="fieldset" sx={{ mt: '8px' }}>
        <FormLabel component="legend">SSH Authentication</FormLabel>
        <RadioGroup
          row
          aria-label="ssh-authentication"
          defaultValue="key"
          value={sshType}
          onChange={(e) => setSshType(e.target.value)}
        >
          <FormControlLabel
            value="key"
            control={<Radio />}
            label="Ssh key file"
          />
          <FormControlLabel
            value="password"
            control={<Radio />}
            label="Password"
          />
        </RadioGroup>
      </FormControl>
      {sshType === 'password' ? (
        <TextField
          required
          sx={{ mt: '4px' }}
          label="SSH password"
          id="password"
          type="password"
          onChange={(e) => setSshPassword(e.target.value)}
          defaultValue={props.selectedNode?.SshPassword}
        />
      ) : (
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
          }}
          startIcon={<CloudUploadIcon />}
        >
          {selectedFile
            ? selectedFile.name
            : props.isUpdating && props.selectedNode?.SshPassword == ''
            ? `${props.selectedNode?.Id}-key.ssh`
            : 'Select SSH private key file'}
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={installNode}
        sx={{
          borderRadius: 5,
          width: { xs: '100%', sm: '50%', md: '350px', lg: '450px' },
          height: '64px',
          mt: '20px',
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h6">
            {props.isUpdating ? 'Update node' : 'Setup node'}
          </Typography>
        )}
      </Button>
      <Typography variant="overline">
        By clicking the button above, you will install a node on your server.
      </Typography>

      <Typography variant="h4" sx={{ mt: 4 }}>
        Don't wait, become an actor of the decentralisation <b>now</b> !
      </Typography>
    </Container>
  );
};

export default Install;
