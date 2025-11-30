import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/Card';
import { CURRENCY_FORMATTER, CATEGORIES } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';

const COLORS = ['#0054A6', '#0077E6', '#3399FF', '#66B2FF', '#99CCFF', '#CCE5FF', '#E6F2FF'];

export const Dashboard: React.FC = () => {
  const { transactions, budgets } = useFinance();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    const currentMonthTrans = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = currentMonthTrans
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = currentMonthTrans
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory = currentMonthTrans
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const pieData = Object.entries(expenseByCategory).map(([catId, amount]) => ({
      name: CATEGORIES.find(c => c.id === catId)?.label || catId,
      value: amount,
    }));

    return { income, expense, balance: income - expense, pieData };
  }, [transactions, currentMonth, currentYear]);

  // Check budgets
  const budgetAlerts = useMemo(() => {
    const alerts: string[] = [];
    const expenseByCategory = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(budgets).forEach(([catId, limitValue]) => {
      const limit = limitValue as number;
      if (limit > 0 && (expenseByCategory[catId] || 0) > limit) {
        const catName = CATEGORIES.find(c => c.id === catId)?.label || catId;
        alerts.push(`Bạn đã chi vượt ngân sách cho "${catName}"!`);
      }
    });
    return alerts;
  }, [transactions, budgets, currentMonth, currentYear]);

  return (
    <div className="space-y-6">
      {/* Introduction for new users */}
      {transactions.length === 0 && (
        <Card className="bg-blue-50 border-blue-100">
          <h3 className="text-vietin font-bold mb-2">Chào mừng bạn đến với VietinFinance!</h3>
          <p className="text-sm text-gray-700">
            Ứng dụng giúp bạn quản lý tài chính đơn giản. Hãy bắt đầu bằng cách vào mục 
            <span className="font-bold"> "Ghi thu chi"</span> để thêm giao dịch đầu tiên của bạn.
          </p>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng thu (Tháng này)</p>
              <p className="text-xl font-bold text-gray-800">{CURRENCY_FORMATTER.format(stats.income)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng chi (Tháng này)</p>
              <p className="text-xl font-bold text-gray-800">{CURRENCY_FORMATTER.format(stats.expense)}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-vietin">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-100 text-vietin">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Số dư hiện tại</p>
              <p className={`text-xl font-bold ${stats.balance >= 0 ? 'text-vietin' : 'text-red-500'}`}>
                {CURRENCY_FORMATTER.format(stats.balance)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-red-700">Cảnh báo ngân sách</h4>
              <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                {budgetAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Chart */}
      <Card title="Phân bổ chi tiêu tháng này">
        {stats.pieData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => CURRENCY_FORMATTER.format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400">
            Chưa có dữ liệu chi tiêu tháng này.
          </div>
        )}
      </Card>
    </div>
  );
};