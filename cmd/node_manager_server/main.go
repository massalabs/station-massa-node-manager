package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	"github.com/massalabs/thyra-plugin-hello-world/pkg/plugin"
	cors "github.com/rs/cors/wrapper/gin"
)

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

func installMassaNode(c *gin.Context) {
	var input node_manager.InstallNodeInput
	if err := c.ShouldBind(&input); err != nil {
		fmt.Println(fmt.Errorf("binding: %w", err))
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	needSshKey := true
	if input.SshPassword != "" {
		needSshKey = false
	}

	nodeToUpdate := c.Query("update")

	isUpdate := nodeToUpdate != ""
	if isUpdate {
		err := node_manager.RemoveNode(nodeToUpdate)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		_, err = os.Stat(node_manager.GetSSHKeyPath(nodeToUpdate))
		if err == nil { // old key file exists

			if needSshKey { // rename ssh key file
				err = node_manager.UpdateSshKeyName(nodeToUpdate, input.Id)
				if err != nil {
					c.JSON(http.StatusInternalServerError, err.Error())
					return
				}
				needSshKey = false
			} else { // password has been provided, delete previous ssh key file
				err = node_manager.RemoveSshKeyIfExist(nodeToUpdate)
				if err != nil {
					fmt.Printf("unable to remove old key file: %s", err)
				}
			}
		}
	}

	if needSshKey && input.SshKeyFile == nil {
		c.JSON(http.StatusInternalServerError, "Ssh key file or password is missing")
		return
	}

	node := input.CreateNode()
	node.SetStatus(node_manager.Installing)

	if err := node_manager.CreateDirIfNotExists(path.Dir(node_manager.GetSSHKeyPath(node.Id))); err != nil {
		fmt.Println(fmt.Errorf("creating dir: %w", err))
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("creating ssh key dir: %s", err.Error()))
		return
	}

	if err := node_manager.CreateDirIfNotExists(path.Dir(node.GetDockerComposePath())); err != nil {
		fmt.Println(fmt.Errorf("creating dir: %w", err))
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("creating docker compose dir: %s", err.Error()))
		return
	}

	if needSshKey {
		if err := c.SaveUploadedFile(input.SshKeyFile, node_manager.GetSSHKeyPath(node.Id)); err != nil {
			fmt.Println(fmt.Errorf("saving file: %w", err))
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("saving ssh key file: %s", err.Error()))
			return
		}
	}

	isDockerComposePresent := input.DockerComposeFile != nil

	if isDockerComposePresent {
		if err := c.SaveUploadedFile(input.DockerComposeFile, node.GetDockerComposePath()); err != nil {
			fmt.Println(fmt.Errorf("saving file: %w", err))
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("saving docker compose file: %s", err.Error()))
			return
		}
	}

	go node_manager.Install(node, isDockerComposePresent)

	c.JSON(http.StatusCreated, gin.H{"message": "Massa Node installation started"})
}

func startNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	output, err := node.StartNode()
	if err != nil {
		fmt.Println(fmt.Errorf("starting node: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Node successfully started", "output": output})
}

func stopNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	output, err := node.StopNode()
	if err != nil {
		fmt.Println(fmt.Errorf("stopping node: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Node successfully stopped", "output": output})
}

func getNodeLogs(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	output, err := node.GetLogs()
	if err != nil {
		fmt.Println(fmt.Errorf("getting logs: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, output)
}

func backupWallet(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	filePath, err := node.BackupWallet()
	if err != nil {
		fmt.Println(fmt.Errorf("creating wallet backup: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	fileName := filepath.Base(filePath)
	c.Header("Content-Disposition", "attachment; filename="+fileName)
	contentType := mime.TypeByExtension(filepath.Ext(filePath))
	c.Header("Content-Type", contentType)

	c.File(filePath)
}

func handleManageNodeRequest(c *gin.Context) (*node_manager.Node, error) {
	nodeId := c.Query("id")

	if nodeId == "" {
		return nil, fmt.Errorf("please provide a node id")
	}

	node, err := node_manager.GetNodeById(nodeId)
	if err != nil {
		return nil, err
	}

	if node == nil {
		return nil, fmt.Errorf("node not found")
	}

	return node, nil
}

func getNodes(c *gin.Context) {
	nodes, err := node_manager.GetNodes()
	if err != nil {
		fmt.Println(fmt.Errorf("getting nodes: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(200, nodes)
}

func getNodeStatus(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	var status node_manager.NodeStatus
	metrics, _ := node.GetSystemMetrics()

	if metrics == nil {
		// Server is not responding
		status = node_manager.Unknown
		c.JSON(200, gin.H{"status": status.String(), "metrics": metrics, "wallet_infos": node_manager.WalletInfo{}, "node_infos": node_manager.State{}})
		return
	}

	status = node.GetStatus()
	var nodeInfos node_manager.State
	var wallet_infos *node_manager.WalletInfo

	if status != node_manager.Installing {
		status, nodeInfos = node.FetchStatus()
		node.SetStatus(status)

		wallet_infos, err = node.WalletInfo()
		if err != nil {
			fmt.Println(fmt.Errorf("getting wallet info: %w", err))
		}
	}
	c.JSON(200, gin.H{"status": status.String(), "metrics": metrics, "wallet_infos": wallet_infos, "node_infos": nodeInfos})
}

func main() {
	//nolint:gomnd
	if len(os.Args) < 2 {
		panic("this program must be run with correlation id argument!")
	}

	// pluginID := os.Args[1]

	standaloneMode := false
	address := ":"

	if len(os.Args) == 3 && os.Args[2] == "--standalone" {
		standaloneMode = true
		address = ":8080"
	}

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)
	router.GET("/node_logs", getNodeLogs)
	router.GET("/node_status", getNodeStatus)
	router.GET("/nodes", getNodes)
	router.GET("/backup_wallet", backupWallet)

	embedStatics(router)

	ln, _ := net.Listen("tcp", address)

	log.Println("Listening on " + ln.Addr().String())
	if !standaloneMode {
		plugin.RegisterPlugin(ln, plugin.Info{
			Name: "Node Manager", Author: "Massalabs",
			Description: "Install and manage Massa nodes", APISpec: "", Logo: "front/public/logo.svg",
		})
	}

	nodes, err := node_manager.GetNodes()
	if err != nil {
		log.Panicln(fmt.Errorf("getting nodes: %w", err))
		return
	}

	for _, node := range nodes {
		status, _ := node.FetchStatus()
		node.SetStatus(status)
	}

	err = http.Serve(ln, router)
	if err != nil {
		log.Fatalln(err)
	}
}
