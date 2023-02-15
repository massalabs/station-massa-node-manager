package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"math/rand"
	"net"
	"net/http"
	"os"
	"runtime"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager/plugin"
	cors "github.com/rs/cors/wrapper/gin"
)

// TODO: Handle multiple NodeRunner
// ? Use a map of NodeRunner ?
var nodeRunner = node_manager.NodeRunner{}

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
	Name string `json:"name" binding:"required"`
}

// ? Should we move this to pkg/node_manager/node_installer.go ?
// ? Might be great to have a get request to list available versions so that endpoint can take a version as parameter ?
// TODO: Add a check to see if the node archive has already been downloaded in cache
func installMassaNode(c *gin.Context) {
	var input InstallNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	nodes, err := node_manager.GetNodes()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	for _, node := range nodes {
		if node.Ip == node_manager.DEFAULT_NODE_IP {
			c.JSON(500, gin.H{"error": "A node is already installed on localhost"})
			return
		}
	}

	os := runtime.GOOS
	arch := runtime.GOARCH

	link, err := node_manager.GetMassaNodeLink(os, arch)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	log.Println("Link: ", link)
	node_manager.DownloadAndUnarchiveNode(link)
	log.Println("Massa Node installed")
	err = node_manager.AddNode(node_manager.Node{
		Id:   int(rand.Uint32()),
		Name: input.Name,
		Ip:   node_manager.DEFAULT_NODE_IP,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Massa Node installed"})
}

func startNode(c *gin.Context) {
	nodes, err := node_manager.GetNodes()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if len(nodes) == 0 {
		c.JSON(500, gin.H{"error": "No node installed"})
		return
	}

	err = nodeRunner.StartNode(nodes[0])
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Node successfully started"})
}

func stopNode(c *gin.Context) {
	err := nodeRunner.StopNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Node successfully stopped"})
}

func getNodeStatus(c *gin.Context) {
	state := nodeRunner.GetNodeState()
	if state != node_manager.RUNNING {
		c.JSON(200, gin.H{"status": nil, "state": state})
		return
	}

	status, err := node_manager.GetStatus()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": status, "state": state})
}

func getNodes(c *gin.Context) {
	nodes, err := node_manager.GetNodes()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, nodes)
}

func register(pluginID string, socket net.Addr) {
	err := plugin.Register(
		pluginID,
		"Node Manager", "massalabs",
		"Install and manage your Massa node.",
		socket,
	)
	if err != nil {
		panic(fmt.Errorf("while registering plugin: %w", err))
	}
}

func main() {

	//nolint:gomnd
	if len(os.Args) != 2 {
		panic("this program must be run with correlation id argument!")
	}

	pluginID := os.Args[1]

	// nodeRunner := node_manager.NodeRunner{}

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)
	router.GET("/node_status", getNodeStatus)
	router.GET("/nodes", getNodes)

	embedStatics(router)

	ln, _ := net.Listen("tcp", ":")

	register(pluginID, ln.Addr())

	err := http.Serve(ln, router)
	if err != nil {
		log.Fatalln(err)
	}
}
