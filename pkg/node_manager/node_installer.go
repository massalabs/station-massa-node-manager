package node_manager

import (
	"embed"
	"fmt"
	"os"
	"path"
	"strings"
)

//go:embed embedFiles/*
var embedFiles embed.FS

func (node *Node) uploadCustomDockerComposeFile() error {
	composeFileName := node.GetDockerComposePath()
	err := node.uploadFileSSH(composeFileName, "/home/"+node.Username+"/docker-compose.yml")
	if err != nil {
		fmt.Printf("failed to upload %s: %s", composeFileName, err)
		return err
	}

	return nil
}

func (node *Node) uploadDefaultDockerComposeFile() error {
	composeFileName := "docker-compose.yml"
	composeFile, err := embedFiles.ReadFile("embedFiles/" + composeFileName)
	if err != nil {
		fmt.Printf("failed to read %s: %s", composeFileName, err)
		return err
	}

	tmpDir := os.TempDir()

	tmpFile := path.Join(tmpDir, composeFileName)
	err = os.WriteFile(tmpFile, composeFile, 0644)
	if err != nil {
		fmt.Printf("failed to write %s: %s", composeFileName, err)
		return err
	}

	defer os.Remove(tmpFile)

	err = node.uploadFileSSH(tmpFile, "/home/"+node.Username+"/"+composeFileName)
	if err != nil {
		fmt.Printf("failed to upload %s: %s", composeFileName, err)
		return err
	}

	return nil
}

func Install(node Node, isDockerComposePresent bool) {
	if os.Chmod(node.GetSSHKeyPath(), 0600) != nil {
		fmt.Println("unable to set sshKey file permissions")
		return
	}

	err := node.addOrUpdateNode()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if isDockerComposePresent {
		err = node.uploadCustomDockerComposeFile()
	} else {
		err = node.uploadDefaultDockerComposeFile()
	}

	if err != nil {
		fmt.Printf("failed to upload docker compose file: %s", err)
	}

	dockerInstallScript := fmt.Sprintf(`
sudo apt-get update
sudo apt-get install -y curl jq
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
rm get-docker.sh
cat << 'EOF' > .env
DISCORD_ID=%s
WALLETPWD=%s
EOF
cat << 'EOF' > docker-container-logrotate
/var/lib/docker/containers/*/*.log {
	rotate 0
	hourly
	notifempty
	nocompress
	size 50M
	missingok
	copytruncate
	nodateext
	maxage 1
	}
EOF
sudo mv docker-container-logrotate /etc/logrotate.d/docker-container-logrotate
sudo docker compose pull
echo "Node installation completed"
`, node.DiscordId, node.WalletPassword)

	output, err := node.runCommandSSH(dockerInstallScript)
	if err != nil || !strings.Contains(string(output), "Node installation completed") {
		fmt.Printf("Installation failed: %s \n %s", err, string(output))
		return
	}

	status, _, err := node.UpdateStatus()
	if err != nil {
		return
	}
	fmt.Printf("Installation success:\n %s", string(output))
	fmt.Printf("New status is: %s", status)
}

func CreateDirIfNotExists(dirname string) error {
	_, err := os.Stat(dirname)
	if os.IsNotExist(err) {
		err = os.Mkdir(dirname, 0755)
		if err != nil {
			return err
		}
	}

	return nil
}
