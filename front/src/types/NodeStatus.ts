export interface Slot {
    period: number;
    thread: number;
}

export default interface NodeStatus {
    node_id: string;
    node_ip: string;
    version: string;
    current_time: Date;
    current_cycle: number;
    connected_nodes: any[];
    last_slot: Slot;
    next_slot: Slot;
    consensus_stats: {
        start_timespan: Date;
        end_timespan: Date;
        final_block_count: number;
        stale_block_count: number;
        clique_count: number;
    };
    pool_stats: number[];
    network_stats: {
        in_connection_count: number;
        out_connection_count: number;
        known_peer_count: number;
        banned_peer_count: number;
        active_node_count: number;
    };
    execution_stats: {
        time_window_start: Date;
        time_window_end: Date;
        final_block_count: number;
        final_executed_operations_count: number;
        active_cursor: {
            period: number;
            thread: number;
        };
    };
    config: {
        genesis_timestamp: Date;
        end_timestamp: Date;
        thread_count: number;
        t0: number;
        delta_f0: number;
        operation_validity_periods: number;
        periods_per_cycle: number;
        block_reward: string;
        roll_price: string;
        max_block_size: string;
    };
}
