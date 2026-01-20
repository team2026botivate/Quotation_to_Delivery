import { WorkflowItem } from '@/context/WorkflowContext';

const customerNames = [
  'Amit Sharma',
  'Neha Verma',
  'Rahul Singh',
  'Priya Patel',
  'Mohit Jain',
];

const items = [
  'Sofa Set',
  'Office Desk',
  'Dining Table',
  'Bed Frame',
  'Cabinet',
  'Chair',
  'Bookshelf',
  'Coffee Table',
];

const locations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
];

function generateId(): string {
  return 'LEAD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generatePhone(): string {
  return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

export function generateDummyData(): WorkflowItem[] {
  const dummyItems: WorkflowItem[] = [];

  for (let i = 0; i < 5; i++) {
    dummyItems.push({
      id: generateId(),
      customerName: customerNames[i % customerNames.length],
      phone: generatePhone(),
      siteLocation: locations[Math.floor(Math.random() * locations.length)],
      requirement: items[Math.floor(Math.random() * items.length)],
      quotationAmount: Math.floor(Math.random() * 500000) + 50000,
      expectedDeliveryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentStage: 'followup',
      stageLogs: [],
      followup_status: 'Pending',
      lead_id: generateId(),
      status: 'Pending',
    });
  }

  return dummyItems;
}
