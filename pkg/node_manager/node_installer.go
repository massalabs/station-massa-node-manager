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

func Install(node Node) {

	if os.Chmod(node.GetSSHKeyPath(), 0600) != nil {
		fmt.Println("unable to set sshKey file permissions")
		return
	}

	err := node.addNode()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	composeFileName := "docker-compose.yml"
	composeFile, err := embedFiles.ReadFile("embedFiles/" + composeFileName)
	if err != nil {
		fmt.Printf("failed to read %s: %s", composeFileName, err)
		return
	}

	tmpDir := os.TempDir()

	tmpFile := path.Join(tmpDir, composeFileName)
	err = os.WriteFile(tmpFile, composeFile, 0644)
	if err != nil {
		fmt.Printf("failed to write %s: %s", composeFileName, err)
		return
	}

	defer os.Remove(tmpFile)

	err = node.uploadFileSSH(tmpFile, "/home/"+node.Username+"/"+composeFileName)
	if err != nil {
		fmt.Printf("failed to upload %s: %s", composeFileName, err)
		return
	}

	dockerInstallScript := fmt.Sprintf(`
	sudo apt-get update
	sudo apt-get install -y curl jq
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
	echo "Node installation completed"
	`, node.DiscordId, node.WalletPassword)

	output, err := node.runCommandSSH(dockerInstallScript)
	if err != nil || !strings.Contains(string(output), "Node installation completed") {
		fmt.Printf("Installation failed: %s \n %s", err, string(output))
		return
	}

	// TODO: call SSH get status here
	node.Status = Up
	fmt.Printf("Installation success:\n %s", string(output))
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
