import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { RecordPage } from './pages/Record';
import { BudgetPage } from './pages/Budget';
import { BackupPage } from './pages/Backup';
import { AppRoutes } from './types';

function App() {
  return (
    <FinanceProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path={AppRoutes.HOME} element={<Dashboard />} />
            <Route path={AppRoutes.TRANSACTIONS} element={<RecordPage />} />
            <Route path={AppRoutes.BUDGET} element={<BudgetPage />} />
            <Route path={AppRoutes.BACKUP} element={<BackupPage />} />
            <Route path="*" element={<Navigate to={AppRoutes.HOME} replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </FinanceProvider>
  );
}

export default App;