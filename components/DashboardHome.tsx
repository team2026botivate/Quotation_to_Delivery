'use client';

import { Card } from '@/components/ui/card';
import { useWorkflow } from '@/context/WorkflowContext';
import { TrendingUp, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

export default function DashboardHome() {
  const { state } = useWorkflow();

  const totalPending = state.items.filter((item) => item.currentStage !== 'payment').length;
  const totalCompleted = state.items.filter((item) => item.currentStage === 'payment').length;
  const totalAmount = state.items.reduce((sum, item) => sum + (item.quotationAmount || 0), 0);
  const todayFollowups = state.items.filter(
    (item) =>
      item.currentStage === 'followup' &&
      new Date(item.expectedDeliveryDate || '').toDateString() === new Date().toDateString()
  ).length;

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
      label: 'Total Amount',
      value: `₹${totalAmount.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Today Followups',
      value: todayFollowups,
      icon: Calendar,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your Quotation to Delivery System</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Activity Trend</h2>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder - Activity trend visualization</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {state.activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              state.activityLog.map((activity, index) => (
                <div key={index} className="pb-4 border-b border-border last:border-0">
                  <p className="text-sm font-medium text-foreground">{activity.customerName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
