package main

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

const MASSA_VERSION = "TEST.17.1"
const MASSA_BASE_URL = "https://github.com/massalabs/massa/releases/download/" + MASSA_VERSION + "/massa_" + MASSA_VERSION + "_release_"

const NODE_ZIP_MACOS_ADM64_URL = MASSA_BASE_URL + "macos.tar.gz"
const NODE_ZIP_MACOS_ARM64_URL = MASSA_BASE_URL + "macos_aarch64.tar.gz"
const NODE_ZIP_LINUX_ADM64_URL = MASSA_BASE_URL + "linux.tar.gz"
const NODE_ZIP_LINUX_ARM64_URL = MASSA_BASE_URL + "linux_arm64.tar.gz"
const NODE_ZIP_WINDOWS_ADM64_URL = MASSA_BASE_URL + "windows.zip"

const CACHE_DIR = ".cache/"
const BIN_DIR = "bin/"

func getMassaNodeLink(os string, arch string) (string, error) {
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

func downloadAndUnarchiveNode(link string) {
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

func installMassaNode() {
	os := runtime.GOOS
	arch := runtime.GOARCH

	link, err := getMassaNodeLink(os, arch)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Link: ", link)
	downloadAndUnarchiveNode(link)
	log.Println("Massa Node installed")
}

func main() {
	installMassaNode()
}
