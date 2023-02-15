package main

import (
	"embed"
	"encoding/base64"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	cors "github.com/rs/cors/wrapper/gin"
)

//go:generate ./install.sh

//go:embed static/*
var staticFiles embed.FS

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		log.Panicln(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}

func embedStatics(router *gin.Engine) {
	router.Use(static.Serve("/", EmbedFolder(staticFiles, "static")))
}

type InstallNodeInput struct {
	User   string `json:"user" binding:"required"`
	Host   string `json:"host" binding:"required"`
	SshKey string `json:"sshkey" binding:"required"`
}

func decodeKey(sshKeyEncoded string) error {
	rawDecodedText, err := base64.StdEncoding.DecodeString(sshKeyEncoded)
	if err != nil {
		return err
	}

	sshKey := []byte(rawDecodedText)
	return os.WriteFile(node_manager.SSHKeyFile, sshKey, 0600)
}

func installMassaNode(c *gin.Context) {
	var input InstallNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := decodeKey(input.SshKey)
	if err != nil {
		c.JSON(400, gin.H{"error": err})
		return
	}

	output, err := node_manager.InstallMassaNode(input.User, input.Host)

	if err != nil {
		c.JSON(400, gin.H{"error": err, "output": output})
		return
	}

	c.JSON(200, gin.H{"message": "Massa Node installed", "output": output})
}

func startNode(c *gin.Context) {
	var input InstallNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := decodeKey(input.SshKey)
	if err != nil {
		c.JSON(400, gin.H{"error": err})
	}

	output, err := node_manager.StartNode(input.User, input.Host)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Node successfully started", "output": output})
}

func stopNode(c *gin.Context) {
	var input InstallNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := decodeKey(input.SshKey)
	if err != nil {
		c.JSON(400, gin.H{"error": err})
	}

	output, err := node_manager.StopNode(input.User, input.Host)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Node successfully stopped", "output": output})
}

func main() {

	//nolint:gomnd
	if len(os.Args) < 2 {
		panic("this program must be run with correlation id argument!")
	}

	standaloneArg := os.Args[2]
	standaloneMode := false
	if standaloneArg == "--standalone" {
		standaloneMode = true
	}

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)

	embedStatics(router)

	ln, _ := net.Listen("tcp", ":")

	log.Println("Listening on " + ln.Addr().String())
	if !standaloneMode {
		// register(pluginID, ln.Addr())
	}

	err := http.Serve(ln, router)
	if err != nil {
		log.Fatalln(err)
	}
}
