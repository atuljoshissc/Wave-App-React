import React, { useMemo } from 'react';
import { Wave, Application } from '@/types/wave';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TimelineChartProps {
  waves: Wave[];
  selectedWaves: string[];
  onWaveExpand: (waveId: string) => void;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ waves, selectedWaves, onWaveExpand }) => {
  const { timelineData, minDate, maxDate, monthsRange } = useMemo(() => {
    if (waves.length === 0) {
      return { timelineData: [], minDate: new Date(), maxDate: new Date(), monthsRange: [] };
    }

    const allApps = waves.flatMap(wave => wave.applications);
    const dates = allApps.flatMap(app => [app.startDate, app.endDate]);
    
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Generate months for header
    const months = [];
    const current = new Date(min.getFullYear(), min.getMonth(), 1);
    const end = new Date(max.getFullYear(), max.getMonth() + 1, 1);
    
    while (current < end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    // Filter and prepare timeline data
    const filteredWaves = selectedWaves.length > 0 
      ? waves.filter(wave => selectedWaves.includes(wave.id))
      : waves;

    const timelineItems = filteredWaves.flatMap(wave => {
      const waveHeader = { 
        id: wave.id, 
        name: wave.name, 
        startDate: new Date(Math.min(...wave.applications.map(a => a.startDate.getTime()))),
        endDate: new Date(Math.max(...wave.applications.map(a => a.endDate.getTime()))),
        waveName: wave.name,
        waveType: wave.type,
        isWaveGroup: true,
        isExpanded: wave.isExpanded
      };
      
      if (wave.isExpanded) {
        return [
          waveHeader,
          ...wave.applications.map(app => ({ 
            ...app, 
            waveName: wave.name, 
            waveType: wave.type,
            isApplication: true 
          }))
        ];
      } else {
        return [waveHeader];
      }
    });

    return { 
      timelineData: timelineItems, 
      minDate: min, 
      maxDate: max, 
      monthsRange: months 
    };
  }, [waves, selectedWaves]);

  const getPositionAndWidth = (startDate: Date, endDate: Date) => {
    const totalDuration = maxDate.getTime() - minDate.getTime();
    const itemStart = startDate.getTime() - minDate.getTime();
    const itemDuration = endDate.getTime() - startDate.getTime();
    
    const left = (itemStart / totalDuration) * 100;
    const width = (itemDuration / totalDuration) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const getBarColor = (type?: string, isWaveGroup?: boolean) => {
    if (isWaveGroup) {
      switch (type) {
        case 'pilot': return 'bg-wave-primary';
        case 'tools': return 'bg-wave-info';
        case 'shared': return 'bg-wave-success';
        default: return 'bg-wave-secondary';
      }
    }
    return 'bg-wave-primary/70';
  };

  if (waves.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-primary-foreground rounded-full" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Timeline Data</h3>
          <p className="text-muted-foreground">Upload wave data to see the timeline visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Timeline View</h2>
          <div className="text-sm text-muted-foreground">
            {minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Month Headers */}
      <div className="bg-secondary/50 border-b border-border px-6 py-2">
        <div className="relative h-8">
          {monthsRange.map((month, index) => {
            const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
            const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
            const position = getPositionAndWidth(monthStart, monthEnd);
            
            return (
              <div
                key={index}
                className="absolute top-0 h-full flex items-center justify-center text-xs font-medium text-muted-foreground border-r border-border/50"
                style={position}
              >
                {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-2">
          {timelineData.map((item, index) => {
            const position = getPositionAndWidth(item.startDate, item.endDate);
            const isWaveGroup = 'isWaveGroup' in item && Boolean(item.isWaveGroup);
            const isApplication = 'isApplication' in item && Boolean(item.isApplication);
            
            return (
              <div key={`${item.id}-${index}`} className="relative">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-48 text-sm font-medium truncate flex items-center gap-2",
                    isWaveGroup ? "text-foreground" : "text-muted-foreground pl-6"
                  )}>
                    {isWaveGroup && (
                      <button
                        onClick={() => onWaveExpand(item.id)}
                        className="p-1 hover:bg-secondary rounded-sm transition-colors"
                      >
                        {item.isExpanded ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </button>
                    )}
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex-1 relative h-8 bg-secondary/30 rounded-lg">
                    <div
                      className={cn(
                        "absolute top-1 bottom-1 rounded-md shadow-sm transition-all hover:shadow-md",
                        isWaveGroup ? getBarColor(item.waveType, true) : 'bg-wave-primary/70'
                      )}
                      style={position}
                    >
                      <div className="h-full flex items-center justify-center text-xs font-medium text-primary-foreground px-2">
                        {isWaveGroup && !item.isExpanded ? `${item.name}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="w-36 text-xs text-muted-foreground">
                    {item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};