package node_manager

import (
	"embed"
	"fmt"
	"os"
	"path"
)

//go:embed embedFiles/*
var embedFiles embed.FS

func Install(node Node) (string, error) {

	if os.Chmod(node.GetSSHKeyPath(), 0600) != nil {
		return "", fmt.Errorf("unable to set sshKey file permissions")
	}

	err := node.addNode()
	if err != nil {
		return "", err
	}

	composeFileName := "docker-compose.yml"
	composeFile, err := embedFiles.ReadFile("embedFiles/" + composeFileName)
	if err != nil {
		return "", fmt.Errorf("failed to read %s: %s", composeFileName, err)
	}

	tmpDir := os.TempDir()

	err = os.WriteFile(path.Join(tmpDir, composeFileName), composeFile, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write %s: %s", composeFileName, err)
	}

	err = node.uploadFileSSH(path.Join(tmpDir, composeFileName), "~/"+composeFileName)
	if err != nil {
		return "", fmt.Errorf("failed to upload %s: %s", composeFileName, err)
	}

	dockerInstallScript := fmt.Sprintf(`
	sudo apt-get update \
	sudo apt-get install -y curl \
	curl -fsSL https://get.docker.com -o get-docker.sh
	sudo sh ./get-docker.sh
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
	sudo docker compose up -d --pull always --remove-orphans
	`, node.DiscordId, node.WalletPassword)

	output, err := node.runCommandSSH(dockerInstallScript)
	if err != nil {
		return "", err
	}

	return string(output), nil
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
