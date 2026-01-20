'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWorkflow, WorkflowItem } from '@/context/WorkflowContext';
import UpdateModal from '@/components/UpdateModal';
import { stageConfigs, StageConfig } from '@/lib/stageConfigs';
import { Search } from 'lucide-react';

export default function DispatchPlanStage() {
  const stage = 'dispatch-plan';
  const { state, dispatch } = useWorkflow();
  const config = stageConfigs[stage] as StageConfig;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!config) {
    return <div className="p-8">Stage not found</div>;
  }

  const pendingItems = state.items.filter(
    (item) =>
      item.currentStage === stage &&
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const historyItems = state.items.filter(
    (item) =>
      item.stageLogs.some((log) => log.stage === stage) &&
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.currentStage !== stage
  );

  const getColumnValue = (item: WorkflowItem, columnName: string): any => {
    // Map common column names to item properties
    const columnMap: Record<string, string> = {
      'Lead ID': 'id',
      'Customer Name': 'customerName',
      'Phone': 'phone',
      'Location': 'siteLocation',
      'Requirement': 'requirement',
      'Item Required': 'requirement',
      'Item Name': 'requirement',
      'Material Name': 'requirement',
      'Quotation Amount': 'quotationAmount',
      'Total Amount': 'quotationAmount',
      'Qty': 'quantity',
      'Quantity': 'quantity',
      'Received Qty': 'receivedQty',
      'Work Done %': 'workDone',
      'Paid Amount': 'paidAmount',
      'Balance': 'balance',
      'Status': 'status',
      'What did customer say?': 'notes',
      'Need Call Date': 'callDate',
      'Remark': 'remark',
      'Stock Available': 'stockAvailable',
      'Available Quantity': 'quantity',
      'Warehouse Location': 'warehouse',
      'Expected Dispatch Date': 'dispatchDate',
      'Vendor Name': 'vendor',
      'PO Number': 'poNumber',
      'PO Date': 'poDate',
      'Expected Delivery Date': 'deliveryDate',
      'Truck Number': 'truckNumber',
      'Driver Name': 'driverName',
      'Driver Contact': 'driverContact',
      'Dispatch Date': 'dispatchDate',
      'Delivery ETA': 'deliveryEta',
      'Received Quantity': 'receivedQty',
      'Damage': 'hasDamage',
      'Damage Notes': 'damageNotes',
      'Received Date': 'receivedDate',
      'Planned Dispatch Date': 'plannedDate',
      'Time Slot': 'timeSlot',
      'Team Assigned': 'teamAssigned',
      'Vehicle Number': 'vehicleNumber',
      'Delivered Date': 'deliveredDate',
      'Customer Confirmation': 'confirmed',
      'Any Issue': 'issues',
      'Installer Name': 'installerName',
      'Installer Contact': 'installerContact',
      'Installation Date': 'installDate',
      'Installation Status': 'installStatus',
      'Issue Notes': 'issueNotes',
      'Payment Mode': 'paymentMode',
      'Payment Date': 'paymentDate',
      'Transaction Reference': 'reference',
    };

    const key = columnMap[columnName];
    if (key && key in item) {
      return item[key as keyof WorkflowItem];
    }

    const snakeCase = columnName.toLowerCase().replace(/\s+/g, '_');
    return item[snakeCase as keyof WorkflowItem] || '-';
  };

  const handleUpdate = (item: WorkflowItem, data: any) => {
    dispatch({
      type: 'MOVE_TO_NEXT_STAGE',
      payload: {
        id: item.id,
        currentStage: stage,
        data,
      },
    });

    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        customerName: item.customerName,
        action: `Updated in ${config.title}`,
        stage: config.title,
      },
    });

    setShowModal(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">{config.title}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">{config.subtitle}</p>
      </div>

      <Card className="p-6 rounded-xl border border-border shadow-sm">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending <Badge variant="secondary" className="ml-2">{pendingItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history">
              History <Badge variant="secondary" className="ml-2">{historyItems.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {config.pendingColumns.map((col) => (
                        <th key={col} className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">
                          {col}
                        </th>
                      ))}
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.pendingColumns.length + 1} className="text-center py-12 text-muted-foreground">
                          No pending items
                        </td>
                      </tr>
                    ) : (
                      pendingItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        {config.pendingColumns.map((col) => {
                          const cellValue = getColumnValue(item, col);
                          return (
                            <td key={col} className="py-2 md:py-3 px-2 md:px-4 text-foreground">
                              {typeof cellValue === 'boolean' ? (cellValue ? 'Yes' : 'No') : String(cellValue)}
                            </td>
                          );
                        })}
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <Button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowModal(true);
                            }}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))
                    )}</tbody>
                </table>
              </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {config.historyColumns.map((col) => (
                        <th key={col} className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">
                          {col}
                        </th>
                      ))}
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.historyColumns.length + 1} className="text-center py-12 text-muted-foreground">
                          No history items
                        </td>
                      </tr>
                    ) : (
                      historyItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        {config.historyColumns.map((col) => {
                          const cellValue = getColumnValue(item, col);
                          return (
                            <td key={col} className="py-2 md:py-3 px-2 md:px-4 text-foreground">
                              {typeof cellValue === 'boolean' ? (cellValue ? 'Yes' : 'No') : String(cellValue)}
                            </td>
                          );
                        })}
                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
                        </td>
                      </tr>
                    ))
                    )}</tbody>
                </table>
              </div>
          </TabsContent>
        </Tabs>
      </Card>

      {selectedItem && (
        <UpdateModal
          item={selectedItem}
          stage={stage}
          config={config}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}
