package node_manager

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"

	"github.com/massalabs/thyra/pkg/node"
)

type ExecutionStats struct {
	TimeWindowStart              *uint      `json:"time_window_start"`
	TimeWindowEnd                *uint      `json:"time_window_end"`
	FinalBlockCount              *uint      `json:"final_block_count"`
	FinalExecutedOperationsCount *uint      `json:"final_executed_operations_count"`
	ActiveCurser                 *node.Slot `json:"active_cursor"`
}

type State struct {
	Config         *Config         `json:"config"`
	ConsensusStats *ConsensusStats `json:"consensus_stats"`
	CurrentCycle   *uint           `json:"current_cycle"`
	CurrentTime    *uint           `json:"current_time"`
	ExecutionStats *ExecutionStats `json:"execution_stats"`
	LastSlot       *node.Slot      `json:"last_slot"`
	NetworkStats   *NetworkStats   `json:"network_stats"`
	NextSlot       *node.Slot      `json:"next_slot"`
	NodeID         *string         `json:"node_id"`
	NodeIP         *string         `json:"node_ip"`
	PoolStats      *[]uint         `json:"pool_stats"`
	Version        *string         `json:"version"`
}

type Config struct {
	BlockReward             *string `json:"block_reward"`
	DeltaF0                 *uint   `json:"delta_f0"`
	EndTimeStamp            *uint   `json:"end_timestamp"`
	GenesisTimestamp        *uint   `json:"genesis_timestamp"`
	OperationValidityParios *uint   `json:"operation_validity_periods"`
	PeriodsPerCycle         *uint   `json:"periods_per_cycle"`
	PosLockCycles           *uint   `json:"pos_lock_cycles"`
	PosLookbackCycle        *uint   `json:"pos_lookback_cycles"`
	RollPrice               *string `json:"roll_price"`
	T0                      *uint   `json:"t0"`
	ThreadCount             *uint   `json:"thread_count"`
}

type ConsensusStats struct {
	CliqueCount         *uint `json:"clique_count"`
	EndTimespan         *uint `json:"end_timespan"`
	FinalBlockCount     *uint `json:"final_block_count"`
	FinalOperationCount *uint `json:"final_operation_count"`
	StakerCount         *uint `json:"staker_count"`
	StaleBlockCount     *uint `json:"stale_block_count"`
	StartTimespan       *uint `json:"start_timespan"`
}

type NetworkStats struct {
	ActiveNodeCount    *uint `json:"active_node_count"`
	BannedPeerCount    *uint `json:"banned_peer_count"`
	InConnectionCount  *uint `json:"in_connection_count"`
	KnowPeerCount      *uint `json:"known_peer_count"`
	OutConnectionCount *uint `json:"out_connection_count"`
}

func Status(client *node.Client) (*State, error) {
	rawResponse, err := client.RPCClient.Call(
		context.Background(),
		"get_status",
	)
	if err != nil {
		return nil, fmt.Errorf("calling get_status: %w", err)
	}

	if rawResponse.Error != nil {
		return nil, rawResponse.Error
	}

	var resp State

	err = rawResponse.GetObject(&resp)
	if err != nil {
		return nil, fmt.Errorf("parsing get_status jsonrpc response '%+v': %w", rawResponse, err)
	}

	return &resp, nil
}

func GetStatus() (*State, error) {
	client := node.NewClient("http://localhost:33035")
	status, err := Status(client)
	if err != nil {
		return nil, err
	}
	return status, nil
}

func GetNodesFilePath() string {
	return path.Join(WorkingDir, NODES_FILENAME)
}

func GetNodes() ([]Node, error) {
	filePath := GetNodesFilePath()

	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		err := os.WriteFile(filePath, []byte(`[]`), 0644)
		if err != nil {
			log.Fatal(err)
		}
	}

	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	var nodes []Node
	err = json.Unmarshal(content, &nodes)
	if err != nil {
		return nil, err
	}

	return nodes, nil
}

func AddNode(node Node) error {
	nodes, err := GetNodes()
	if err != nil {
		return err
	}

	nodes = append(nodes, node)

	filePath := GetNodesFilePath()
	content, err := json.Marshal(nodes)
	if err != nil {
		return err
	}

	os.WriteFile(filePath, content, 0644)
	return nil
}
