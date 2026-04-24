import { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import Button from '../Button/Button';
import ProgressBarFile from '../ProgressBarFile/ProgressBarFile';
import './BulkImport.css';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://backend-savings-app.vercel.app/api/v1';

// Upload phase occupies 0-70%, server processing phase occupies 70-95%.
// The remaining 5% is reserved for the final response snap to 100%.
const UPLOAD_MAX = 70;
const PROCESSING_MAX = 95;

const BulkImport = ({ onImported }) => {
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);
  const processingIntervalRef = useRef(null);

  const clearProcessingInterval = () => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
  };

  const startProcessingSimulation = () => {
    clearProcessingInterval();
    // Slowly creep from current position toward PROCESSING_MAX.
    // Each tick adds a smaller increment the closer we get to the cap (easing).
    processingIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= PROCESSING_MAX) {
          clearProcessingInterval();
          return prev;
        }
        const remaining = PROCESSING_MAX - prev;
        const increment = Math.max(0.4, remaining * 0.04);
        return Math.min(PROCESSING_MAX, prev + increment);
      });
    }, 300);
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        // Map real upload progress to 0-UPLOAD_MAX range
        const pct = Math.round((event.loaded / event.total) * UPLOAD_MAX);
        setProgress(pct);
      }
    };

    xhr.upload.onload = () => {
      // File fully uploaded to server — start simulating processing progress
      setProgress(UPLOAD_MAX);
      startProcessingSimulation();
    };

    xhr.onloadstart = () => {
      clearProcessingInterval();
      setProgress(0);
      setUploadStatus('uploading');
      setStatusMessage('');
    };

    xhr.onload = () => {
      clearProcessingInterval();
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setUploadStatus('success');
          const msg = result.errors?.length
            ? `${result.created} imported. ${result.errors.length} row(s) skipped.`
            : `${result.created} transaction(s) imported successfully.`;
          setStatusMessage(msg);
          onImported?.();
          setTimeout(() => setUploadStatus(null), 5000);
        } else {
          setUploadStatus('error');
          setStatusMessage(result?.message || 'Import failed.');
          setTimeout(() => setUploadStatus(null), 5000);
        }
      } catch {
        setUploadStatus('error');
        setStatusMessage('Unexpected server response.');
        setTimeout(() => setUploadStatus(null), 5000);
      }
    };

    xhr.onerror = () => {
      clearProcessingInterval();
      setUploadStatus('error');
      setStatusMessage('Network error. Please try again.');
      setTimeout(() => setUploadStatus(null), 5000);
    };

    xhr.open('POST', `${BASE_URL}/transactions/bulk`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  return (
    <div className="bulk-import">
      <div className="bulk-import-header">
        <h3 className="bulk-import-title">Upload your transactions in bulk</h3>
        <p className="bulk-import-description">Download the template, fill it in, and upload it here.</p>
      </div>
      <div className="bulk-import-actions">
        <a href="/assets/transactions_import_template.xlsx" download>
          <Button
            text={<span className="bulk-import-btn-content"><Download size={16} /><span>Download Template</span></span>}
            className="bulk-import-btn"
          />
        </a>
        <Button
          text={<span className="bulk-import-btn-content"><Upload size={16} /><span>Upload File</span></span>}
          onClick={() => fileInputRef.current?.click()}
          className="bulk-import-btn bulk-import-btn--primary"
          disabled={uploadStatus === 'uploading'}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleBulkUpload}
        />
      </div>
      <ProgressBarFile
        progress={progress}
        status={uploadStatus}
        message={statusMessage}
      />
    </div>
  );
};

export default BulkImport;
