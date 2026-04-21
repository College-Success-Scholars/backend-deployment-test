/** Types mirroring backend/src/models/traffic.model.ts */

export interface TrafficRow {
  id: number;
  created_at: string;
  uid: string | null;
  traffic_type: string | null;
}

export interface TrafficSession {
  uid: string;
  entryAt: string;
  exitAt: string;
  durationMs: number;
  assumedExit?: boolean;
}

export type WeekEntryCount = {
  weekNumber: number;
  entryCount: number;
};
