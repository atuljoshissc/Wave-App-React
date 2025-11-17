import React from 'react';
import { ChevronDown, ChevronRight, Layers, Settings, Waves, Users } from 'lucide-react';
import { Wave as WaveType } from '@/types/wave';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface WaveSidebarProps {
  waves: WaveType[];
  selectedWaves: string[];
  onWaveToggle: (waveId: string) => void;
  onWaveExpand: (waveId: string) => void;
  collapsed?: boolean;
}

const getWaveIcon = (type?: string) => {
  switch (type) {
    case 'pilot': return Layers;
    case 'tools': return Settings;
    case 'shared': return Users;
    default: return Waves;
  }
};

const getWaveColor = (type?: string) => {
  switch (type) {
    case 'pilot': return 'text-wave-primary';
    case 'tools': return 'text-wave-info';
    case 'shared': return 'text-wave-success';
    default: return 'text-wave-secondary';
  }
};

export const WaveSidebar: React.FC<WaveSidebarProps> = ({
  waves,
  selectedWaves,
  onWaveToggle,
  onWaveExpand,
  collapsed = false
}) => {
  // Collapsed view: icon-only narrow column
  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 space-y-2 transition-all duration-300 ease-in-out">
        {waves.length === 0 ? (
          <Waves className="w-6 h-6 text-muted-foreground" />
        ) : (
          waves.map(wave => {
            const Icon = getWaveIcon(wave.type);
            const isSelected = selectedWaves.includes(wave.id);
            return (
              <button
                key={wave.id}
                onClick={() => onWaveToggle(wave.id)}
                title={wave.name}
                className={cn(
                  'p-2 rounded-md transition-all duration-200 ease-in-out transform',
                  isSelected ? 'bg-wave-primary/10 scale-105' : 'hover:bg-accent/10 hover:scale-105'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-colors duration-200', getWaveColor(wave.type))} />
              </button>
            );
          })
        )}
      </div>
    );
  }

  // Expanded view: full sidebar
  if (waves.length === 0) {
    return (
      <div className="p-6 text-center transition-all duration-300 ease-in-out">
        <Waves className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No wave data loaded</p>
        <p className="text-sm text-muted-foreground mt-1">Upload a CSV file to get started</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Wave Groups</h3>
        <div className="space-y-2">
          {waves.map((wave) => {
            const Icon = getWaveIcon(wave.type);
            const isSelected = selectedWaves.includes(wave.id);
            const isExpanded = wave.isExpanded;

            return (
              <div key={wave.id} className="space-y-1">
                <div className={cn(
                  'flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-transform transition-colors duration-200 ease-in-out',
                  isSelected ? 'bg-wave-primary/10 scale-[1.01]' : 'scale-100'
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onWaveExpand(wave.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-3 h-3 transition-transform duration-200" />
                    )}
                  </Button>

                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onWaveToggle(wave.id)}
                    className="data-[state=checked]:bg-wave-primary data-[state=checked]:border-wave-primary transition-colors duration-200"
                  />

                  <Icon className={cn('w-4 h-4 transition-colors duration-200', getWaveColor(wave.type))} />

                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{wave.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {wave.applications.length} application{wave.applications.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className={cn(
                  'ml-8 space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
                  isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                )}>
                  {wave.applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 transition-transform duration-200 ease-in-out"
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full transition-colors duration-200',
                        app.status === 'completed' ? 'bg-wave-success' :
                        app.status === 'in-progress' ? 'bg-wave-primary' :
                        app.status === 'delayed' ? 'bg-wave-error' :
                        'bg-wave-warning'
                      )} />
                      <div className="flex-1">
                        <div className="text-sm text-foreground">{app.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {app.startDate.toLocaleDateString()} - {app.endDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};