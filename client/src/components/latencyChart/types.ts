import type {ChartDataPoint} from "@/types";

export interface LatencyChartProps {
  data: ChartDataPoint[],
  latencies: number[],
  startIndex: number
}
