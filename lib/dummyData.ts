
import { WorkflowItem } from '@/context/WorkflowContext';

const customerNames = [
  'Amit Sharma', 'Neha Verma', 'Rahul Singh', 'Priya Patel', 'Mohit Jain',
  'Gaurav Kumar', 'Anjali Gupta', 'Rohan Mehta', 'Sita Ram', 'Vikram Yadav'
];

const items = [
  'Sofa Set', 'Office Desk', 'Dining Table', 'Bed Frame',
  'Cabinet', 'Chair', 'Bookshelf', 'Coffee Table'
];

const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune',
  'Hyderabad', 'Chennai', 'Kolkata'
];

const stages = [
  'followup',
  'stock',
  'po',
  'delivery', 
  'receiving',
  'dispatch-plan',
  'dispatch',
  'confirmation',
  'installation',
  'install-material',
  'customer-review',
  'payment'
];

function generateId(): string {
  return 'LEAD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generatePhone(): string {
  return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

function getRandomDate(daysOffset: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

export function generateDummyData(): WorkflowItem[] {
  const dummyItems: WorkflowItem[] = [];

  stages.forEach((stage) => {
    for (let i = 0; i < 2; i++) {
        const name = customerNames[Math.floor(Math.random() * customerNames.length)];
        
        dummyItems.push({
            id: generateId(),
            customerName: name,
            phone: generatePhone(),
            siteLocation: locations[Math.floor(Math.random() * locations.length)],
            requirement: items[Math.floor(Math.random() * items.length)],
            quotationAmount: Math.floor(Math.random() * 500000) + 50000,
            expectedDeliveryDate: getRandomDate(10),
            currentStage: stage,
            stageLogs: [],
            
            // Populate common fields for various stages so columns aren't empty
            status: 'interested',
            notes: 'Customer is looking for premium finish',
            callDate: getRandomDate(2),
            stockAvailable: 'yes',
            quantity: Math.floor(Math.random() * 10) + 1,
            warehouse: 'Central Warehouse',
            dispatchDate: getRandomDate(5),
            vendor: 'Global Furnishings Ltd',
            poNumber: 'PO-' + Math.floor(1000 + Math.random() * 9000),
            poDate: getRandomDate(-2),
            deliveryDate: getRandomDate(7),
            truckNumber: 'TR-' + Math.floor(1000 + Math.random() * 9000), // Tracking Number
            driverName: 'Fast Transporters', // Transporter Name
            driverContact: generatePhone(),
            deliveryEta: '2:00 PM',
            receivedQty: Math.floor(Math.random() * 10) + 1,
            hasDamage: 'no',
            damageNotes: '',
            receivedDate: getRandomDate(1),
            plannedDate: getRandomDate(3),
            timeSlot: 'Morning',
            teamAssigned: 'Team Alpha',
            vehicleNumber: 'DL-01-AB-1234',
            confirmed: 'yes',
            issues: '',
            installerName: 'Rajesh Kumar',
            installerContact: generatePhone(),
            installDate: getRandomDate(4),
            workDone: 0,
            installStatus: 'pending',
            paidAmount: 0,
            paymentMode: 'upi',
            paymentDate: getRandomDate(0),
            reference: 'UPI-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            remark: 'Generated dummy data'
        });
    }
  });

  return dummyItems;
}
