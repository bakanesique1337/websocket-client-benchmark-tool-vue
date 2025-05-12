import type {ConnectionStatus} from "@/types";

export interface StatsProps {
  status: ConnectionStatus,
  active: string,
  sent: number,
  received: number,
  avgLatency: number,
  minLatency: number,
  maxLatency: number,
  time: number
}
