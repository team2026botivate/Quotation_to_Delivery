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

export default function FollowupStage() {
  const stage = 'followup';
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
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
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
      'Need Time Date': 'callDate',
      'Upload Image': 'image',
      'Upload Video': 'video',
      'Remark': 'remark',
      'Stock Available': 'stockAvailable',
      'Available Quantity': 'quantity',
      'Warehouse Location': 'warehouse',
      'Expected Dispatch Date': 'dispatchDate',
      'Vendor Name': 'vendor',
      'PO Number': 'poNumber',
      'PO Date': 'poDate',
      'Expected Delivery Date': 'deliveryDate',
      'Tracking Number': 'truckNumber',
      'Transporter Name': 'driverName',
      'Contact Number': 'driverContact',
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
    if (data.status === 'follow_up' || data.status === 'need_time') {
      dispatch({
        type: 'LOG_STAGE_ACTION',
        payload: {
          id: item.id,
          stage: stage,
          data,
        },
      });
    } else {
      dispatch({
        type: 'MOVE_TO_NEXT_STAGE',
        payload: {
          id: item.id,
          currentStage: stage,
          data,
        },
      });
    }

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
    <div className="p-2 md:p-4">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground text-balance">{config.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">{config.subtitle}</p>
      </div>

      <Card className="p-3 rounded-lg border border-border shadow-sm">
        <Tabs defaultValue="pending" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <TabsList className="h-10">
              <TabsTrigger value="pending" className="text-sm">
                Pending <Badge variant="secondary" className="ml-2 px-2 text-xs">{pendingItems.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm">
                History <Badge variant="secondary" className="ml-2 px-2 text-xs">{historyItems.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by customer name..."
                className="pl-9 h-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="pending" className="space-y-4">
            <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-1.5 md:py-2 px-4 md:px-6 font-semibold text-foreground">Action</th>
                      {config.pendingColumns.map((col) => (
                        <th key={col} className="text-left py-1.5 md:py-2 px-2 md:px-3 font-semibold text-foreground">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.pendingColumns.length + 1} className="text-center py-6 text-muted-foreground text-xs">
                          No pending items
                        </td>
                      </tr>
                    ) : (
                      pendingItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        <td className="py-1.5 md:py-2 px-4 md:px-6">
                          <Button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowModal(true);
                            }}
                            size="sm"
                            className="h-8 px-4 text-xs font-semibold"
                          >
                            Update
                          </Button>
                        </td>
                        {config.pendingColumns.map((col) => {
                          const cellValue = getColumnValue(item, col);
                          return (
                            <td key={col} className="py-1 md:py-1.5 px-2 md:px-3 text-foreground">
                              {typeof cellValue === 'boolean' ? (cellValue ? 'Yes' : 'No') : String(cellValue)}
                            </td>
                          );
                        })}
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
                        <th key={col} className="text-left py-1.5 md:py-2 px-2 md:px-3 font-semibold text-foreground">
                          {col}
                        </th>
                      ))}
                      </tr>
                  </thead>
                  <tbody>
                    {historyItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.historyColumns.length + 1} className="text-center py-6 text-muted-foreground text-xs">
                          No history items
                        </td>
                      </tr>
                    ) : (
                      historyItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                        {config.historyColumns.map((col) => {
                          const cellValue = getColumnValue(item, col);
                          return (
                            <td key={col} className="py-1 md:py-1.5 px-2 md:px-3 text-foreground">
                              {typeof cellValue === 'boolean' ? (cellValue ? 'Yes' : 'No') : String(cellValue)}
                            </td>
                          );
                        })}
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
