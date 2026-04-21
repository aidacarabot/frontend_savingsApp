import { useState, useEffect, useRef } from 'react';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import Button from '../Button/Button';
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
      <Button className="dropdown-trigger" onClick={toggle} aria-label="Options" text={<Ellipsis size={20} />} />

      {isOpen && (
        <div className="dropdown-menu">
          <Button className="dropdown-item edit" onClick={handleEdit} text={<><Pencil size={16} /><span>Edit</span></>} />
          <Button className="dropdown-item delete" onClick={handleDeleteRequest} text={<><Trash2 size={16} /><span>Delete</span></>} />
        </div>
      )}
    </div>
  );
};

export default DropDown;