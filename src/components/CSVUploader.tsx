import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveData, Wave, Application } from '@/types/wave';
import { useToast } from '@/hooks/use-toast';

interface CSVUploaderProps {
  onUpload: (data: WaveData) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload }) => {
  const { toast } = useToast();

  const parseCSV = useCallback((csvContent: string): WaveData => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const waves: Wave[] = [];
    let currentWave: Wave | null = null;

    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header
      
      const [waveName, appName, startDate, endDate, status] = line.split(',').map(s => s.trim());
      
      if (!currentWave || currentWave.name !== waveName) {
        if (currentWave) waves.push(currentWave);
        currentWave = {
          id: `wave-${waves.length + 1}`,
          name: waveName,
          applications: [],
          isExpanded: false,
          type: waveName.toLowerCase().includes('pilot') ? 'pilot' :
                waveName.toLowerCase().includes('tools') ? 'tools' :
                waveName.toLowerCase().includes('shared') ? 'shared' : 'wave'
        };
      }

      if (appName && startDate && endDate) {
        const app: Application = {
          id: `${currentWave.id}-app-${currentWave.applications.length + 1}`,
          name: appName,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: (status as any) || 'planned'
        };
        currentWave.applications.push(app);
      }
    });

    if (currentWave) waves.push(currentWave);
    return { waves };
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const waveData = parseCSV(csvContent);
        onUpload(waveData);
        toast({
          title: "CSV uploaded successfully",
          description: `Loaded ${waveData.waves.length} waves with ${waveData.waves.reduce((acc, w) => acc + w.applications.length, 0)} applications`
        });
      } catch (error) {
        toast({
          title: "Error parsing CSV",
          description: "Please check your CSV format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [parseCSV, onUpload, toast]);

  const loadSampleData = useCallback(() => {
    const sampleData: WaveData = {
      waves: [
        {
          id: 'pilot-wave',
          name: 'Pilot Wave',
          type: 'pilot',
          isExpanded: false,
          applications: [
            { id: 'app-1', name: 'CentralLog', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-15'), status: 'planned' },
            { id: 'app-2', name: 'CRAN', startDate: new Date('2025-06-15'), endDate: new Date('2025-09-01'), status: 'planned' },
            { id: 'app-3', name: 'TOSCA', startDate: new Date('2025-07-01'), endDate: new Date('2025-10-15'), status: 'planned' },
            { id: 'app-4', name: 'VDI', startDate: new Date('2025-07-15'), endDate: new Date('2025-11-01'), status: 'planned' }
          ]
        },
        {
          id: 'tools-a',
          name: 'WG 0 - IT Tools A',
          type: 'tools',
          isExpanded: false,
          applications: [
            { id: 'app-5', name: 'DHCP', startDate: new Date('2025-08-01'), endDate: new Date('2025-10-15'), status: 'planned' },
            { id: 'app-6', name: 'Hitachi SAN', startDate: new Date('2025-08-15'), endDate: new Date('2025-11-01'), status: 'planned' },
            { id: 'app-7', name: 'SEP', startDate: new Date('2025-09-01'), endDate: new Date('2025-12-15'), status: 'planned' }
          ]
        },
        {
          id: 'wave-group-2',
          name: 'Wave Group 2',
          type: 'wave',
          isExpanded: false,
          applications: [
            { id: 'app-8', name: 'Application A', startDate: new Date('2025-10-01'), endDate: new Date('2025-12-31'), status: 'planned' },
            { id: 'app-9', name: 'Application B', startDate: new Date('2025-11-01'), endDate: new Date('2026-02-15'), status: 'planned' }
          ]
        }
      ]
    };
    onUpload(sampleData);
    toast({
      title: "Sample data loaded",
      description: "You can now explore the wave planning features"
    });
  }, [onUpload, toast]);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="csv-upload" className="block text-sm font-medium text-foreground mb-2">
          Upload CSV File
        </label>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-auto p-3"
          onClick={() => document.getElementById('csv-upload')?.click()}
        >
          <Upload className="w-4 h-4" />
          <div className="text-left">
            <div className="font-medium">Choose CSV file</div>
            <div className="text-xs text-muted-foreground">Wave, App, Start Date, End Date, Status</div>
          </div>
        </Button>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      <Button
        variant="secondary"
        className="w-full justify-start gap-2"
        onClick={loadSampleData}
      >
        <FileSpreadsheet className="w-4 h-4" />
        Load Sample Data
      </Button>
    </div>
  );
};