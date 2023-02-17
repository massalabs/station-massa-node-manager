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

	logRotateFileName := "docker-container-logrotate"
	logRotateFile, err := embedFiles.ReadFile("embedFiles/" + logRotateFileName)
	if err != nil {
		return "", fmt.Errorf("failed to read %s: %s", logRotateFileName, err)
	}

	tmpDir := os.TempDir()

	err = os.WriteFile(path.Join(tmpDir, composeFileName), composeFile, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write %s: %s", composeFileName, err)
	}

	err = os.WriteFile(path.Join(tmpDir, logRotateFileName), logRotateFile, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to write %s: %s", logRotateFileName, err)
	}

	err = node.uploadFileSSH(path.Join(tmpDir, composeFileName), "/home/"+composeFileName)
	if err != nil {
		return "", fmt.Errorf("failed to upload %s: %s", composeFileName, err)
	}

	err = node.uploadFileSSH(path.Join(tmpDir, logRotateFileName), "/etc/logrotate.d/"+logRotateFileName)
	if err != nil {
		return "", fmt.Errorf("failed to upload %s: %s", logRotateFileName, err)
	}

	dockerInstallScript := fmt.Sprintf(`
	sudo apt-get update \
	sudo apt-get install -y curl \
	curl -fsSL https://get.docker.com -o get-docker.sh
	sudo sh ./get-docker.sh
	cat << 'EOF' > /home/.env
	DISCORD_ID=%s
	WALLETPWD=%s
	EOF
	cd /home
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
