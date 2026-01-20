'use client';

import { Button } from '@/components/ui/button';
import { HomeIcon, CheckCircle2, Package, FileText, Truck, Box, Calendar, Send, CheckSquare, Users, Wrench, DollarSign } from 'lucide-react';

type StageType = 'home' | 'followup' | 'stock' | 'po' | 'delivery' | 'receiving' | 'dispatch-plan' | 'dispatch' | 'confirmation' | 'installation' | 'install-material' | 'payment';

interface SidebarProps {
  currentStage: StageType;
  onStageChange: (stage: StageType) => void;
}

const stages = [
  { id: 'home', label: 'Dashboard', icon: HomeIcon },
  { id: 'followup', label: '1. Followup Customer', icon: CheckCircle2 },
  { id: 'stock', label: '2. Check Delivery From Stock', icon: Package },
  { id: 'po', label: '3. Make PO', icon: FileText },
  { id: 'delivery', label: '4. Truck Delivery', icon: Truck },
  { id: 'receiving', label: '5. Receiving Stock', icon: Box },
  { id: 'dispatch-plan', label: '6. Dispatch Planning', icon: Calendar },
  { id: 'dispatch', label: '7. Dispatch', icon: Send },
  { id: 'confirmation', label: '8. Receiving Confirmation', icon: CheckSquare },
  { id: 'installation', label: '9. Send to Installation', icon: Users },
  { id: 'install-material', label: '10. Install to Material', icon: Wrench },
  { id: 'payment', label: '11. Payment Collection', icon: DollarSign },
];

export default function Sidebar({ currentStage, onStageChange }: SidebarProps) {
  return (
    <div className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto h-screen flex-col">
      <div className="p-6 border-b border-sidebar-border sticky top-0 bg-sidebar">
        <h1 className="text-2xl font-bold text-sidebar-foreground text-balance">Q2D System</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">Quotation to Delivery</p>
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;

          return (
            <Button
              key={stage.id}
              onClick={() => onStageChange(stage.id as StageType)}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-left text-sm font-medium">{stage.label}</span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
