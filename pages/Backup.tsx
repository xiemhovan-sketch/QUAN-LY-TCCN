import React, { useRef, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Download, Upload, AlertTriangle, FileJson, CheckCircle } from 'lucide-react';
import { AppData } from '../types';

export const BackupPage: React.FC = () => {
  const { exportData, importData, resetData } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{msg: string, type: 'error' | 'success' | 'info'} | null>(null);
  const [pendingData, setPendingData] = useState<AppData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        // Basic validation
        if (Array.isArray(data.transactions) && typeof data.budgets === 'object') {
           setPendingData(data as AppData);
           setImportStatus({
             msg: `Tìm thấy ${data.transactions.length} giao dịch trong tệp.`,
             type: 'info'
           });
        } else {
           throw new Error("Cấu trúc tệp không hợp lệ");
        }
      } catch (err) {
        setImportStatus({ msg: "Tệp JSON không hợp lệ hoặc bị lỗi.", type: 'error' });
        setPendingData(null);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const confirmImport = (mode: 'merge' | 'replace') => {
    if (pendingData) {
      if (mode === 'replace') {
         if (!window.confirm("Cảnh báo: Tất cả dữ liệu hiện tại sẽ bị xóa và thay thế bằng dữ liệu từ tệp. Bạn có chắc chắn không?")) {
           return;
         }
      }
      importData(pendingData, mode);
      setImportStatus({ msg: "Nhập dữ liệu thành công!", type: 'success' });
      setPendingData(null);
    }
  };

  const handleReset = () => {
    if(window.confirm("Bạn có chắc muốn xóa TOÀN BỘ dữ liệu trên ứng dụng này không? Hành động này không thể hoàn tác.")) {
      resetData();
      setImportStatus({ msg: "Đã xóa toàn bộ dữ liệu.", type: 'success' });
    }
  }

  return (
    <div className="space-y-6">
      
      <Card title="Xuất dữ liệu (Sao lưu)" icon={<Download size={20}/>}>
        <p className="text-sm text-gray-600 mb-4">
          Tải xuống toàn bộ dữ liệu giao dịch và ngân sách của bạn dưới dạng tệp JSON. Bạn nên làm điều này thường xuyên để tránh mất dữ liệu.
        </p>
        <Button onClick={exportData} variant="outline" fullWidth>
          <Download size={18} /> Tải xuống bản sao lưu
        </Button>
      </Card>

      <Card title="Nhập dữ liệu (Khôi phục)" icon={<Upload size={20}/>}>
        <p className="text-sm text-gray-600 mb-4">
          Khôi phục dữ liệu từ tệp JSON đã sao lưu trước đó.
        </p>
        
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {!pendingData && (
          <Button onClick={() => fileInputRef.current?.click()} variant="primary" fullWidth>
            <FileJson size={18} /> Chọn tệp JSON
          </Button>
        )}

        {importStatus && (
          <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
            importStatus.type === 'error' ? 'bg-red-100 text-red-700' : 
            importStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'
          }`}>
             {importStatus.type === 'error' && <AlertTriangle size={18} className="mt-0.5"/>}
             {importStatus.type === 'success' && <CheckCircle size={18} className="mt-0.5"/>}
             <span>{importStatus.msg}</span>
          </div>
        )}

        {pendingData && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2">Chọn phương thức nhập:</h4>
            <div className="space-y-3">
              <Button onClick={() => confirmImport('merge')} variant="secondary" fullWidth>
                Gộp dữ liệu (Giữ dữ liệu cũ)
              </Button>
              <div className="text-xs text-gray-500 text-center">Hoặc</div>
              <Button onClick={() => confirmImport('replace')} variant="danger" fullWidth>
                Thay thế toàn bộ (Xóa dữ liệu cũ)
              </Button>
              <Button onClick={() => { setPendingData(null); setImportStatus(null); }} variant="outline" fullWidth>
                Hủy bỏ
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="pt-8 border-t border-gray-200">
        <button onClick={handleReset} className="text-red-500 text-sm hover:underline w-full text-center">
          Xóa sạch dữ liệu ứng dụng
        </button>
      </div>

    </div>
  );
};