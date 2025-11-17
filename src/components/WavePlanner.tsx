import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WaveData } from '@/types/wave';
import { WaveSidebar } from './WaveSidebar';
import { TimelineChart } from './TimelineChart';
import { CSVUploader } from './CSVUploader';
import { Header } from './Header';

export const WavePlanner: React.FC = () => {
  const [waveData, setWaveData] = useState<WaveData>({ waves: [] });
  const [selectedWaves, setSelectedWaves] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCSVUpload = (data: WaveData) => {
    setWaveData(data);
  };

  const handleWaveToggle = (waveId: string) => {
    setSelectedWaves(prev => 
      prev.includes(waveId) 
        ? prev.filter(id => id !== waveId)
        : [...prev, waveId]
    );
  };

  const handleWaveExpand = (waveId: string) => {
    setWaveData(prev => ({
      ...prev,
      waves: prev.waves.map(wave => 
        wave.id === waveId 
          ? { ...wave, isExpanded: !wave.isExpanded }
          : wave
      )
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} border-r border-border bg-card relative transition-all`}>
          <button
            className="absolute top-4 right-0 translate-x-1/2 z-20 p-1 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setSidebarCollapsed(s => !s)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-border">
              <CSVUploader onUpload={handleCSVUpload} />
            </div>
          )}
          <WaveSidebar 
            waves={waveData.waves}
            selectedWaves={selectedWaves}
            onWaveToggle={handleWaveToggle}
            onWaveExpand={handleWaveExpand}
            collapsed={sidebarCollapsed}
          />
        </div>
        <div className="flex-1 bg-gradient-chart">
          <TimelineChart 
            waves={waveData.waves}
            selectedWaves={selectedWaves}
            onWaveExpand={handleWaveExpand}
          />
        </div>
      </div>
    </div>
  );
};