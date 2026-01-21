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
      label: 'Total Pending',
      value: totalPending,
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Total Completed',
      value: totalCompleted,
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Total Value',
      value: `₹${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Todays Followups',
      value: todayFollowups,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const stageKeys = [
    'followup', 'stock', 'po', 'delivery', 'receiving', 
    'dispatch-plan', 'dispatch', 'confirmation', 'installation', 
    'install-material', 'payment'
  ];

  const stageLabels: Record<string, string> = {
    'followup': 'Followup Customer',
    'stock': 'Check Delivery from Stock',
    'po': 'Make PO',
    'delivery': 'Track Delivery',
    'receiving': 'Receiving Stock',
    'dispatch-plan': 'Dispatch Planning',
    'dispatch': 'Dispatch',
    'confirmation': 'Receiving Confirmation',
    'installation': 'Send to Installation',
    'install-material': 'Install to Material',
    'payment': 'Payment Collection'
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your Quotation to Delivery System</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className={`${stat.bgColor} p-1.5 rounded-md`}>
                  <Icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Overview List */}
        <div className="lg:col-span-2">
            <Card className="rounded-xl border border-border shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-border bg-muted/30">
                    <h2 className="text-lg font-semibold text-foreground">Stage Overview</h2>
                    <p className="text-sm text-muted-foreground">Current status of items across all workflow stages</p>
                </div>
                <div className="divide-y divide-border">
                    {stageKeys.map((key) => {
                        const pendingCount = state.items.filter(i => i.currentStage === key).length;
                        const historyCount = state.items.filter(i => i.stageLogs.some(l => l.stage === key) && i.currentStage !== key).length;

                        return (
                            <div key={key} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {key.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-foreground">{stageLabels[key]}</span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                        <span className="text-muted-foreground">Pending:</span>
                                        <span className="font-semibold text-foreground">{pendingCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span className="text-muted-foreground">History:</span>
                                        <span className="font-semibold text-foreground">{historyCount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>

        {/* Right Column: Recent Activity & Detailed Stats */}
        <div className="space-y-6">
            {/* Detailed Followup Stats */}
            <Card className="rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                    <h2 className="text-base font-semibold text-foreground">Detailed Followup Stats</h2>
                </div>
                <div className="p-4 space-y-4">
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
