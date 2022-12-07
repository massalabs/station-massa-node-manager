package node_manager

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
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

	defer resp.Body.Close()

	err = os.MkdirAll(CACHE_DIR, 0755)
	if err != nil {
		log.Fatalln("Cache dir creation: ", err)
	}

	filename := filepath.Base(link)
	out, err := os.Create(CACHE_DIR + filename)
	if err != nil {
		log.Fatalln("Cache file creation: ", err)
	}
	defer out.Close()

	log.Println("File: ", out.Name())

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	err = os.MkdirAll(BIN_DIR, 0755)
	if err != nil {
		log.Fatalln("Bin dir creation: ", err)
	}

	switch filepath.Ext(link) {
	case ".zip":
		log.Println("unzip", "-o", out.Name(), "-d", BIN_DIR)
		err := exec.Command("unzip", "-o", out.Name(), "-d", BIN_DIR).Run()
		if err != nil {
			log.Fatalln("Failed unziping: ", err)
		}
	case ".gz":
		log.Println("tar", "-xvf", out.Name(), "-C", BIN_DIR)
		err := exec.Command("tar", "-xvf", out.Name(), "-C", BIN_DIR).Run()
		if err != nil {
			log.Fatalln("Failed untarring: ", err)
		}
	}
}
