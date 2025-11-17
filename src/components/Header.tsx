import React from 'react';
import { Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Wave Planning Chart</h1>
            <p className="text-sm text-muted-foreground">Interactive timeline visualization</p>
          </div>
        </div>
        
      </div>
    </header>
  );
};