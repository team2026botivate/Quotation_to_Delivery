'use client';

import { Card } from '@/components/ui/card';
import { useWorkflow } from '@/context/WorkflowContext';
import { TrendingUp, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

export default function DashboardHome() {
  const { state } = useWorkflow();

  const totalPending = state.items.filter((item) => item.currentStage !== 'completed').length;
  const totalCompleted = state.items.filter((item) => item.currentStage === 'completed').length;
  const totalAmount = state.items.reduce((sum, item) => sum + (item.quotationAmount || 0), 0);
  const todayFollowups = state.items.filter(
    (item) =>
      item.currentStage === 'followup' &&
      new Date(item.expectedDeliveryDate || '').toDateString() === new Date().toDateString()
  ).length;

  // Detailed Followup Stats Calculation
  const followupItems = state.items.filter(item => item.stageLogs.some(log => log.stage === 'followup') || item.currentStage === 'followup');
  
  const followupStats = {
      followUp: followupItems.filter(item => item['status'] === 'follow_up').length,
      orderReceive: followupItems.filter(item => item['status'] === 'order_received').length,
      notReceive: followupItems.filter(item => item['status'] === 'not_received').length,
      needTime: followupItems.filter(item => item['status'] === 'need_time').length
  };

  const stats = [
    {
      label: 'Pending Tasks',
      value: totalPending,
      icon: TrendingUp,
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200/50',
    },
    {
      label: 'Completed',
      value: totalCompleted,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200/50',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200/50',
    },
    {
      label: 'Today Followups',
      value: todayFollowups,
      icon: Calendar,
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200/50',
    },
  ];

  const stageKeys = [
    'followup', 'stock', 'po', 'delivery', 'receiving', 
    'dispatch-plan', 'dispatch', 'confirmation', 'installation', 
    'install-material', 'customer-review', 'payment'
  ];

  const stageLabels: Record<string, string> = {
    'followup': 'Quotation Followup',
    'stock': 'Check Delivery For Stock',
    'po': 'Make PO',
    'delivery': 'Track Delivery',
    'receiving': 'Receiving Stock',
    'dispatch-plan': 'Dispatch Planning',
    'dispatch': 'Dispatch',
    'confirmation': 'Receiving Confirmation',
    'installation': 'Send to Installation',
    'install-material': 'Install to Material',
    'customer-review': 'Customer Review',
    'payment': 'Payment Collection'
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your production and delivery pipeline</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`p-6 rounded-2xl border ${stat.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[140px] group relative overflow-hidden bg-white`}>
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-110 opacity-50`} />
              
              <div className="flex justify-between items-start relative z-10">
                <div className={`${stat.bgColor} p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
              
              <div className="mt-auto relative z-10">
                <p className="text-3xl font-bold text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stage Overview List */}
        <div className="lg:col-span-2">
            <Card className="rounded-lg border border-border shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b border-border bg-muted/30">
                    <h2 className="text-base font-semibold text-foreground">Stage Overview</h2>
                    <p className="text-xs text-muted-foreground">Current status of items across all workflow stages</p>
                </div>
                <div className="divide-y divide-border">
                    {stageKeys.map((key) => {
                        const pendingCount = state.items.filter(i => i.currentStage === key).length;
                        const historyCount = state.items.filter(i => i.stageLogs.some(l => l.stage === key) && i.currentStage !== key).length;

                        return (
                            <div key={key} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1 sm:mb-0">
                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                        {key.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">{stageLabels[key]}</span>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"></span>
                                        <span className="text-muted-foreground font-medium">Pending:</span>
                                        <span className="font-semibold text-foreground text-sm">{pendingCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                        <span className="text-muted-foreground font-medium">History:</span>
                                        <span className="font-semibold text-foreground text-sm">{historyCount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>

        {/* Right Column: Recent Activity & Detailed Stats */}
        <div className="space-y-4">
            {/* Detailed Followup Stats */}
            <Card className="rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="p-3 border-b border-border bg-muted/30">
                    <h2 className="text-sm font-semibold text-foreground">Detailed Followup Stats</h2>
                </div>
                <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Follow Up</span>
                        <span className="font-bold text-foreground">{followupStats.followUp}</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(followupStats.followUp / (followupItems.length || 1)) * 100}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Order Received</span>
                        <span className="font-bold text-foreground">{followupStats.orderReceive}</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(followupStats.orderReceive / (followupItems.length || 1)) * 100}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Not Received</span>
                        <span className="font-bold text-foreground">{followupStats.notReceive}</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(followupStats.notReceive / (followupItems.length || 1)) * 100}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Need Time</span>
                        <span className="font-bold text-foreground">{followupStats.needTime}</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(followupStats.needTime / (followupItems.length || 1)) * 100}%` }}></div>
                    </div>
                </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 rounded-xl border border-border shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-6">
                {state.activityLog.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                ) : (
                state.activityLog.map((activity, index) => (
                    <div key={index} className="relative pl-6 pb-6 last:pb-0 border-l border-border last:border-0">
                    <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex flex-col gap-1 -mt-1">
                        <p className="text-sm font-medium text-foreground">{activity.customerName}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide opacity-70">{activity.timestamp}</p>
                    </div>
                    </div>
                ))
                )}
            </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
