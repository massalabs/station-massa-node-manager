import NodeStatus from "./NodeStatus";

export type NodeMonitor = {
  status: 'Unknown' | 'Up' | 'Down' | 'Installing' | 'Bootstrapping';
  metrics: { CPU: number; RAM: number; Disk: number };
  wallet_infos: {
    Active_rolls: number;
    Candidate_balance: string;
    Candidate_rolls: number;
    Final_balance: string;
    Final_rolls: number;
    Thread: number;
  };
  node_infos: NodeStatus;
};
