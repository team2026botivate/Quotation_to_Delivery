'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHome from '@/components/DashboardHome';
import StageScreen from '@/components/StageScreen';
import { WorkflowProvider, useWorkflow } from '@/context/WorkflowContext';
import { generateDummyData } from '@/lib/dummyData';

type StageType = 'home' | 'followup' | 'stock' | 'po' | 'delivery' | 'receiving' | 'dispatch-plan' | 'dispatch' | 'confirmation' | 'installation' | 'install-material' | 'payment';

function HomeContent() {
  const [currentStage, setCurrentStage] = useState<StageType>('home');
  const { dispatch } = useWorkflow();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const dummyData = generateDummyData();
      dummyData.forEach((item) => {
        dispatch({
          type: 'ADD_ITEM',
          payload: item,
        });
      });
      setInitialized(true);
    }
  }, [dispatch, initialized]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Sidebar currentStage={currentStage} onStageChange={setCurrentStage} />
      <main className="flex-1 overflow-auto min-h-screen md:min-h-0">
        {currentStage === 'home' ? (
          <DashboardHome />
        ) : (
          <StageScreen stage={currentStage} />
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <WorkflowProvider>
      <HomeContent />
    </WorkflowProvider>
  );
}
