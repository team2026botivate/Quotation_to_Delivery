"use client";

import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  CheckCircle2,
  Package,
  FileText,
  Truck,
  Box,
  Calendar,
  Send,
  CheckSquare,
  Users,
  Wrench,
  DollarSign,
  LogOut,
  Star,
} from "lucide-react";
import Image from "next/image";

type StageType =
  | "home"
  | "followup"
  | "stock"
  | "po"
  | "delivery"
  | "receiving"
  | "dispatch-plan"
  | "dispatch"
  | "confirmation"
  | "installation"
  | "install-material"
  | "customer-review"
  | "payment";

interface SidebarProps {
  currentStage: StageType;
  onStageChange: (stage: StageType) => void;
  onLogout: () => void;
  role: string;
}

const stages = [
  { id: "home", label: "Dashboard", icon: HomeIcon },
  { id: "followup", label: "Quotation Followup", icon: CheckCircle2 },
  { id: "stock", label: "Check Delivery For Stock", icon: Package },
  { id: "po", label: "Make PO", icon: FileText },
  { id: "delivery", label: "Track Delivery", icon: Truck },
  { id: "receiving", label: "Receiving Stock", icon: Box },
  { id: "dispatch-plan", label: "Dispatch Planning", icon: Calendar },
  { id: "dispatch", label: "Dispatch", icon: Send },
  { id: "confirmation", label: "Receiving Confirmation", icon: CheckSquare },
  { id: "installation", label: "Send to Installation", icon: Users },
  { id: "install-material", label: "Install to Material", icon: Wrench },
  { id: "customer-review", label: "Customer Review", icon: Star },
  { id: "payment", label: "Payment Collection", icon: DollarSign },
];

const userAllowedStages = [
  "home",
  "followup",
  "stock",
  "receiving",
  "confirmation",
  "installation",
  "install-material",
  "customer-review",
];

export default function Sidebar({ currentStage, onStageChange, onLogout, role }: SidebarProps) {
  const visibleStages = role === 'admin' 
    ? stages 
    : stages.filter(stage => userAllowedStages.includes(stage.id));

  return (
    <div className="hidden md:flex w-64 bg-sidebar border-r border-sidebar-border overflow-hidden h-screen flex-col">
      <div className="p-4 border-b border-sidebar-border bg-sidebar flex flex-col items-center text-center">
        <Image 
          loading='lazy'
          width={100}
          height={100}
          src="./logo.png" 
          alt="ELEM Logo" 
          className="h-14 w-14 object-cover rounded-full mb-2 border border-sidebar-border shadow-sm"
        />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground leading-tight">
            Quotation to Delivery
          </h3>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>
        </div>
      </div>

      <nav className="p-2 space-y-0.5 flex-1">
        {visibleStages.map((stage) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;

          return (
            <Button
              key={stage.id}
              onClick={() => onStageChange(stage.id as StageType)}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-2.5 px-3 py-1.5 h-9 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-left text-sm font-medium tracking-tight">
                {stage.label}
              </span>
            </Button>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border mt-auto">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-2.5 px-3 py-1.5 h-9 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-[17px] h-[17px] flex-shrink-0" />
          <span className="text-left text-sm font-medium tracking-tight">
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
}
