export interface Application {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  status?: 'planned' | 'in-progress' | 'completed' | 'delayed';
}

export interface Wave {
  id: string;
  name: string;
  applications: Application[];
  isExpanded?: boolean;
  type?: 'pilot' | 'tools' | 'wave' | 'shared';
}

export interface WaveData {
  waves: Wave[];
}