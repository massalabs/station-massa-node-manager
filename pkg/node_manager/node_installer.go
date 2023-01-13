package node_manager

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
)

func GetMassaNodeLink(os string, arch string) (string, error) {
	log.Println("OS: ", os)
	log.Println("Arch: ", arch)

	switch os {
	case "darwin":
		switch arch {
		case "amd64":
			return NODE_ZIP_MACOS_ADM64_URL, nil
		case "arm64":
			return NODE_ZIP_MACOS_ARM64_URL, nil
		}
	case "linux":
		switch arch {
		case "amd64":
			return NODE_ZIP_LINUX_ADM64_URL, nil
		case "arm64":
			return NODE_ZIP_LINUX_ARM64_URL, nil
		}
	case "windows":
		switch arch {
		case "amd64":
			return NODE_ZIP_WINDOWS_ADM64_URL, nil
		}
	}
	return "", errors.New("OS not supported")
}

func DownloadAndUnarchiveNode(link string) {
	resp, err := http.Get(link)
	if err != nil {
		log.Fatalln(err)
	}

	cacheDir := getCacheDir()
	err = os.MkdirAll(cacheDir, 0755)
	if err != nil {
		log.Fatalln("Cache dir creation: ", err)
	}

	filename := filepath.Base(link)
	createdFile, err := os.Create(path.Join(cacheDir, filename))
	if err != nil {
		log.Fatalln("Cache file creation: ", err)
	}

	defer func() {
		err := resp.Body.Close()
		if err != nil {
			log.Fatalln(err)
		}

		err = createdFile.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}()

	log.Println("File: ", createdFile.Name())

	_, err = io.Copy(createdFile, resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	binDir := getBinDir()
	err = os.MkdirAll(binDir, 0755)
	if err != nil {
		log.Fatalln("Bin dir creation: ", err)
	}

	cmd := exec.Command("tar", "-xvf", createdFile.Name(), "-C", binDir)
	cmd.Stdout = os.Stdout
	err = cmd.Run()
	if err != nil {
		log.Fatalln("Failed untarring: ", err)
	}
}
