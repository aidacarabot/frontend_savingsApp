import { useState, useEffect, useRef } from 'react';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
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
    <div className="dropdown-container" ref={rootRef}>
      <button className="dropdown-trigger" onClick={toggle} aria-label="Options">
        <Ellipsis size={20} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item edit" onClick={handleEdit}>
            <Pencil size={16} />
            <span>Edit</span>
          </button>
          <button className="dropdown-item delete" onClick={handleDeleteRequest}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DropDown;