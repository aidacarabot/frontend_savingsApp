import './ProgressBarFile.css';

const UPLOAD_MAX = 70;

const ProgressBarFile = ({ progress, status, message }) => {
  if (status === null) return null;

  const isProcessing = status === 'uploading' && progress >= UPLOAD_MAX;

  const label = (() => {
    if (status === 'success') return 'Import complete';
    if (status === 'error') return 'Import failed';
    if (isProcessing) return 'Processing...';
    return 'Uploading...';
  })();

  return (
    <div className={`progress-bar-file progress-bar-file--${status}`}>
      <div className="progress-bar-file__header">
        <span className="progress-bar-file__label">{label}</span>
        <span
          className="progress-bar-file__percent"
          style={{ visibility: status === 'uploading' ? 'visible' : 'hidden' }}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar-file__track">
        <div
          className="progress-bar-file__fill"
          style={{ width: `${status === 'error' ? 100 : progress}%` }}
        />
      </div>
      {message && (
        <p className="progress-bar-file__message">{message}</p>
      )}
    </div>
  );
};

export default ProgressBarFile;
