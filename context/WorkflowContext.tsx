'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface WorkflowItem {
  id: string;
  customerName: string;
  phone: string;
  siteLocation: string;
  requirement?: string;
  quotationAmount?: number;
  expectedDeliveryDate?: string;
  currentStage: string;
  stageLogs: StageLog[];
  [key: string]: any;
}

export interface StageLog {
  stage: string;
  timestamp: string;
  data: any;
}

interface WorkflowState {
  items: WorkflowItem[];
  activityLog: { timestamp: string; action: string; customerName: string; stage: string }[];
}

type WorkflowAction =
  | { type: 'ADD_ITEM'; payload: WorkflowItem }
  | { type: 'UPDATE_ITEM'; payload: WorkflowItem }
  | { type: 'MOVE_TO_NEXT_STAGE'; payload: { id: string; currentStage: string; data: any } }
  | { type: 'ADD_ACTIVITY'; payload: { customerName: string; action: string; stage: string } };

const WorkflowContext = createContext<
  | {
      state: WorkflowState;
      dispatch: React.Dispatch<WorkflowAction>;
    }
  | undefined
>(undefined);

const initialState: WorkflowState = {
  items: [],
  activityLog: [],
};

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'ADD_ITEM': {
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'UPDATE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    }

    case 'MOVE_TO_NEXT_STAGE': {
      const { id, currentStage, data } = action.payload;
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
        'payment',
      ];
      const currentIndex = stages.indexOf(currentStage);
      const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : currentStage;

      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === id) {
            const newLog: StageLog = {
              stage: currentStage,
              timestamp: new Date().toISOString(),
              data,
            };
            return {
              ...item,
              currentStage: nextStage,
              stageLogs: [...item.stageLogs, newLog],
            };
          }
          return item;
        }),
      };
    }

    case 'ADD_ACTIVITY': {
      return {
        ...state,
        activityLog: [
          {
            ...action.payload,
            timestamp: new Date().toLocaleString(),
          },
          ...state.activityLog,
        ].slice(0, 5),
      };
    }

    default:
      return state;
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
