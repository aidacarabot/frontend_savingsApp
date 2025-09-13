import { useState, useEffect, useRef } from 'react';
import './DropDown.css';

const DropDown = ({ transactionId, onDeleteRequest, onEditRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen((v) => !v);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEditRequest) onEditRequest(transactionId);
    setIsOpen(false);
  };

  const handleDeleteRequest = (e) => {
    e.stopPropagation();
    if (onDeleteRequest) onDeleteRequest(transactionId);
    setIsOpen(false);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="select" ref={rootRef}>
      <div className="selected" onClick={toggle} role="button" tabIndex={0}>
        <span className="dots">...</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="arrow"
        >
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
          ></path>
        </svg>
      </div>

      <div className={`options ${isOpen ? 'open' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
        <div title="option-edit" onClick={handleEdit} style={{ cursor: 'pointer' }}>
          <label className="option" data-txt="Edit" aria-hidden="true"></label>
        </div>
        <div title="option-delete" onClick={handleDeleteRequest} style={{ cursor: 'pointer' }}>
          <label className="option" data-txt="Delete" aria-hidden="true"></label>
        </div>
      </div>
    </div>
  );
};

export default DropDown;