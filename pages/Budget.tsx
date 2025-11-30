import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/Card';
import { CATEGORIES, CURRENCY_FORMATTER } from '../constants';
import { Button } from '../components/Button';
import { Edit2, Save, X } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { transactions, budgets, updateBudget } = useFinance();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const spendingData = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    return expenseByCategory;
  }, [transactions, currentMonth, currentYear]);

  const handleEdit = (catId: string, currentLimit: number) => {
    setEditingCategory(catId);
    setTempBudget(currentLimit.toString());
  };

  const handleSave = (catId: string) => {
    updateBudget(catId, Number(tempBudget));
    setEditingCategory(null);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-vietin mb-4">
        Đặt giới hạn chi tiêu cho từng danh mục để kiểm soát tài chính tốt hơn. 
        Thanh trạng thái sẽ chuyển đỏ khi bạn chi tiêu quá mức.
      </div>

      {CATEGORIES.map(cat => {
        const spent = spendingData[cat.id] || 0;
        const limit = budgets[cat.id] || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        const isOverBudget = limit > 0 && spent > limit;
        const isEditing = editingCategory === cat.id;
        const remaining = limit - spent;

        return (
          <Card key={cat.id} className="relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{cat.label}</h4>
              </div>
              
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-24 p-1 border rounded text-right text-sm"
                    autoFocus
                  />
                  <button onClick={() => handleSave(cat.id)} className="text-green-600 p-1"><Save size={18}/></button>
                  <button onClick={() => setEditingCategory(null)} className="text-gray-400 p-1"><X size={18}/></button>
                </div>
              ) : (
                <button 
                  onClick={() => handleEdit(cat.id, limit)} 
                  className="text-gray-400 hover:text-vietin text-xs flex items-center gap-1"
                >
                  {limit > 0 ? 'Sửa ngân sách' : 'Đặt ngân sách'} <Edit2 size={12} />
                </button>
              )}
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Đã chi: {CURRENCY_FORMATTER.format(spent)}</span>
              <span className="font-semibold text-gray-700">
                Ngân sách: {CURRENCY_FORMATTER.format(limit)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-red-500' : 'bg-vietin'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>

            {limit > 0 && (
              <div className={`text-xs text-right font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                 {isOverBudget 
                   ? `Vượt ngân sách ${CURRENCY_FORMATTER.format(spent - limit)}` 
                   : `Còn lại ${CURRENCY_FORMATTER.format(remaining)}`
                 } ({percentage.toFixed(0)}%)
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};