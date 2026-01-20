export interface StageConfig {
  id: string;
  title: string;
  subtitle: string;
  pendingColumns: string[];
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'file' | 'checkbox' | 'slider';
    required?: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
  }>;
}

type StageKey = 'followup' | 'stock' | 'po' | 'delivery' | 'receiving' | 'dispatch-plan' | 'dispatch' | 'confirmation' | 'installation' | 'install-material' | 'payment';

export const stageConfigs: Record<StageKey, StageConfig> = {
  followup: {
    id: 'followup',
    title: 'Followup Customer',
    subtitle: 'Manage pending and completed records',
    pendingColumns: ['Lead ID', 'Customer Name', 'Phone', 'Location', 'Requirement', 'Quotation Amount', 'Followup Status'],
    formFields: [
      { name: 'status', label: 'Status', type: 'select', required: true, options: [{ label: 'Interested', value: 'interested' }, { label: 'Not Interested', value: 'not_interested' }, { label: 'Need Time', value: 'need_time' }, { label: 'Confirmed', value: 'confirmed' }] },
      { name: 'notes', label: 'What did customer say?', type: 'textarea', placeholder: 'Enter customer response...' },
      { name: 'callDate', label: 'Need Call Date', type: 'date' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add any remarks...' },
    ],
  },
  stock: {
    id: 'stock',
    title: 'Check for Delivery From Stock',
    subtitle: 'Verify stock availability and delivery readiness',
    pendingColumns: ['Lead ID', 'Customer Name', 'Item Required', 'Quantity', 'Stock Available', 'ETA'],
    formFields: [
      { name: 'stockAvailable', label: 'Stock Available', type: 'select', required: true, options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { name: 'quantity', label: 'Available Quantity', type: 'number', placeholder: 'Enter quantity' },
      { name: 'warehouse', label: 'Warehouse Location', type: 'text', placeholder: 'Enter warehouse location' },
      { name: 'dispatchDate', label: 'Expected Dispatch Date', type: 'date' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  po: {
    id: 'po',
    title: 'Make PO',
    subtitle: 'Purchase Order creation and tracking',
    pendingColumns: ['Lead ID', 'Customer Name', 'Vendor Name', 'Item Name', 'Qty', 'PO Status'],
    formFields: [
      { name: 'vendor', label: 'Vendor Name', type: 'text', required: true, placeholder: 'Enter vendor name' },
      { name: 'poNumber', label: 'PO Number', type: 'text', required: true, placeholder: 'Enter PO number' },
      { name: 'poDate', label: 'PO Date', type: 'date', required: true },
      { name: 'deliveryDate', label: 'Expected Delivery Date', type: 'date' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  delivery: {
    id: 'delivery',
    title: 'Truck Delivery',
    subtitle: 'Track truck and driver information for delivery',
    pendingColumns: ['Lead ID', 'Customer Name', 'Truck Number', 'Driver Name', 'Dispatch Date', 'Status'],
    formFields: [
      { name: 'truckNumber', label: 'Truck Number', type: 'text', required: true, placeholder: 'Enter truck number' },
      { name: 'driverName', label: 'Driver Name', type: 'text', required: true, placeholder: 'Enter driver name' },
      { name: 'driverContact', label: 'Driver Contact', type: 'text', placeholder: 'Enter contact number' },
      { name: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
      { name: 'deliveryEta', label: 'Delivery ETA', type: 'text', placeholder: 'Enter estimated arrival time' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  receiving: {
    id: 'receiving',
    title: 'Receiving Stock',
    subtitle: 'Record material receipt and damage assessment',
    pendingColumns: ['Lead ID', 'Customer Name', 'Material Name', 'Received Qty', 'Damage', 'Status'],
    formFields: [
      { name: 'receivedQty', label: 'Received Quantity', type: 'number', required: true, placeholder: 'Enter quantity received' },
      { name: 'hasDamage', label: 'Damage', type: 'select', required: true, options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { name: 'damageNotes', label: 'Damage Notes', type: 'textarea', placeholder: 'Describe damage if any...' },
      { name: 'receivedDate', label: 'Received Date', type: 'date', required: true },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  'dispatch-plan': {
    id: 'dispatch-plan',
    title: 'Dispatch Planning for Customer',
    subtitle: 'Plan dispatch schedule and team assignment',
    pendingColumns: ['Lead ID', 'Customer Name', 'Planned Date', 'Time Slot', 'Team Assigned', 'Status'],
    formFields: [
      { name: 'plannedDate', label: 'Planned Dispatch Date', type: 'date', required: true },
      { name: 'timeSlot', label: 'Time Slot', type: 'select', required: true, options: [{ label: 'Morning', value: 'morning' }, { label: 'Afternoon', value: 'afternoon' }, { label: 'Evening', value: 'evening' }] },
      { name: 'teamAssigned', label: 'Team Assigned', type: 'text', required: true, placeholder: 'Enter team members' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  dispatch: {
    id: 'dispatch',
    title: 'Dispatch',
    subtitle: 'Dispatch with image and video proof',
    pendingColumns: ['Lead ID', 'Customer Name', 'Dispatch Date', 'Vehicle', 'Proof Uploaded', 'Status'],
    formFields: [
      { name: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
      { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true, placeholder: 'Enter vehicle number' },
      { name: 'image', label: 'Upload Image', type: 'file' },
      { name: 'video', label: 'Upload Video', type: 'file' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  confirmation: {
    id: 'confirmation',
    title: 'Receiving Confirmation',
    subtitle: 'Confirm delivery and note any issues',
    pendingColumns: ['Lead ID', 'Customer Name', 'Delivered Date', 'Customer Confirmation', 'Status'],
    formFields: [
      { name: 'deliveredDate', label: 'Delivered Date', type: 'date', required: true },
      { name: 'confirmed', label: 'Customer Confirmation', type: 'select', required: true, options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
      { name: 'issues', label: 'Any Issue', type: 'textarea', placeholder: 'Describe any issues...' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  installation: {
    id: 'installation',
    title: 'Send to Installation',
    subtitle: 'Assign installer and schedule installation',
    pendingColumns: ['Lead ID', 'Customer Name', 'Installer Name', 'Installation Date', 'Status'],
    formFields: [
      { name: 'installerName', label: 'Installer Name', type: 'text', required: true, placeholder: 'Enter installer name' },
      { name: 'installerContact', label: 'Installer Contact', type: 'text', placeholder: 'Enter contact number' },
      { name: 'installDate', label: 'Installation Date', type: 'date', required: true },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  'install-material': {
    id: 'install-material',
    title: 'Install to Material',
    subtitle: 'Track installation progress and completion',
    pendingColumns: ['Lead ID', 'Customer Name', 'Work Done %', 'Installation Status'],
    formFields: [
      { name: 'workDone', label: 'Work Done %', type: 'slider' },
      { name: 'installStatus', label: 'Installation Status', type: 'select', required: true, options: [{ label: 'Completed', value: 'completed' }, { label: 'Partial', value: 'partial' }, { label: 'Pending', value: 'pending' }] },
      { name: 'issueNotes', label: 'Issue Notes', type: 'textarea', placeholder: 'Note any issues...' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
  payment: {
    id: 'payment',
    title: 'Payment Collection',
    subtitle: 'Track payment status and collection',
    pendingColumns: ['Lead ID', 'Customer Name', 'Total Amount', 'Paid Amount', 'Balance', 'Payment Status'],
    formFields: [
      { name: 'paidAmount', label: 'Paid Amount', type: 'number', required: true, placeholder: 'Enter amount paid' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'select', required: true, options: [{ label: 'Cash', value: 'cash' }, { label: 'UPI', value: 'upi' }, { label: 'Bank Transfer', value: 'bank' }] },
      { name: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { name: 'reference', label: 'Transaction Reference', type: 'text', placeholder: 'Enter reference number' },
      { name: 'remark', label: 'Remark', type: 'textarea', placeholder: 'Add remarks...' },
    ],
  },
};
