import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CATEGORIES, CURRENCY_FORMATTER, formatDate } from '../constants';
import { Transaction, TransactionType } from '../types';
import { Plus, Trash2, Filter, Search } from 'lucide-react';

export const RecordPage: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // Form State
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0].id);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter State
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().substring(0, 7)); // YYYY-MM

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      type,
      amount: Number(amount),
      category,
      date,
      note,
    });

    // Reset form mostly
    setAmount('');
    setNote('');
    setSuccessMsg('Đã lưu giao dịch thành công!');
    setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('list');
    }, 1000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType;
      const matchMonth = t.date.startsWith(filterMonth);
      return matchType && matchMonth;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterMonth]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'list' ? 'bg-vietin text-white shadow' : 'text-gray-500 hover:text-vietin'
          }`}
        >
          Danh sách giao dịch
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'add' ? 'bg-vietin text-white shadow' : 'text-gray-500 hover:text-vietin'
          }`}
        >
          Ghi giao dịch mới
        </button>
      </div>

      {activeTab === 'add' && (
        <Card title="Nhập thông tin giao dịch">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 rounded-lg border font-medium ${
                  type === 'income' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300 text-gray-500'
                }`}
              >
                Thu nhập
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-lg border font-medium ${
                  type === 'expense' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-300 text-gray-500'
                }`}
              >
                Chi tiêu
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ví dụ: 50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vietin focus:border-vietin outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vietin focus:border-vietin outline-none bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giao dịch</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vietin focus:border-vietin outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Ăn trưa với đồng nghiệp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vietin focus:border-vietin outline-none"
              />
            </div>

            {successMsg && (
              <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center font-medium">
                {successMsg}
              </div>
            )}

            <Button type="submit" fullWidth>Lưu giao dịch</Button>
          </form>
        </Card>
      )}

      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <Card className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tháng</label>
                <input 
                  type="month" 
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Loại</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="all">Tất cả</option>
                  <option value="income">Thu nhập</option>
                  <option value="expense">Chi tiêu</option>
                </select>
              </div>
            </div>
          </Card>

          {/* List */}
          <div className="space-y-3 pb-20">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Search className="mx-auto mb-2 opacity-50" size={32} />
                <p>Không tìm thấy giao dịch nào.</p>
              </div>
            ) : (
              filteredTransactions.map((t) => {
                const isIncome = t.type === 'income';
                const catLabel = CATEGORIES.find(c => c.id === t.category)?.label || t.category;
                
                return (
                  <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className={`p-2 rounded-full flex-shrink-0 ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {isIncome ? <Plus size={18} /> : <div className="w-[18px] h-[2px] bg-red-600 my-[8px]"></div>}
                       </div>
                       <div className="min-w-0">
                         <h4 className="font-semibold text-gray-800 truncate">{catLabel}</h4>
                         <p className="text-xs text-gray-500">{formatDate(t.date)} {t.note ? `• ${t.note}` : ''}</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                       <span className={`font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                         {isIncome ? '+' : '-'}{CURRENCY_FORMATTER.format(t.amount)}
                       </span>
                       <button 
                        onClick={() => {
                          if(window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
                            deleteTransaction(t.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};