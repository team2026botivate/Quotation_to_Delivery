'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import LoginPage from '@/components/LoginPage';
import DashboardHome from '@/components/DashboardHome';
import FollowupStage from '@/components/stages/FollowupStage';
import StockStage from '@/components/stages/StockStage';
import POStage from '@/components/stages/POStage';
import DeliveryStage from '@/components/stages/DeliveryStage';
import ReceivingStage from '@/components/stages/ReceivingStage';
import DispatchPlanStage from '@/components/stages/DispatchPlanStage';
import DispatchStage from '@/components/stages/DispatchStage';
import ConfirmationStage from '@/components/stages/ConfirmationStage';
import InstallationStage from '@/components/stages/InstallationStage';
import InstallMaterialStage from '@/components/stages/InstallMaterialStage';
import PaymentStage from '@/components/stages/PaymentStage';
import { WorkflowProvider, useWorkflow } from '@/context/WorkflowContext';
import { generateDummyData } from '@/lib/dummyData';

type StageType = 'home' | 'followup' | 'stock' | 'po' | 'delivery' | 'receiving' | 'dispatch-plan' | 'dispatch' | 'confirmation' | 'installation' | 'install-material' | 'payment';

function HomeContent() {
  const [currentStage, setCurrentStage] = useState<StageType>('home');
  const { state, dispatch } = useWorkflow();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && state.items.length === 0) {
      const savedState = localStorage.getItem('workflowState_v2');
      if (!savedState) {
        const dummyData = generateDummyData();
        dummyData.forEach((item) => {
          dispatch({
            type: 'ADD_ITEM',
            payload: item,
          });
        });
      }
      setInitialized(true);
    }
  }, [dispatch, initialized, state.items.length]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setAuthInitialized(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!authInitialized) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      <Sidebar currentStage={currentStage} onStageChange={setCurrentStage} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto min-h-screen md:min-h-0">
        {currentStage === 'home' && <DashboardHome />}
        {currentStage === 'followup' && <FollowupStage />}
        {currentStage === 'stock' && <StockStage />}
        {currentStage === 'po' && <POStage />}
        {currentStage === 'delivery' && <DeliveryStage />}
        {currentStage === 'receiving' && <ReceivingStage />}
        {currentStage === 'dispatch-plan' && <DispatchPlanStage />}
        {currentStage === 'dispatch' && <DispatchStage />}
        {currentStage === 'confirmation' && <ConfirmationStage />}
        {currentStage === 'installation' && <InstallationStage />}
        {currentStage === 'install-material' && <InstallMaterialStage />}
        {currentStage === 'payment' && <PaymentStage />}
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
