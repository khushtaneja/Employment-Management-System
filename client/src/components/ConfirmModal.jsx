import { RiAlertLine, RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';

const ConfirmModal = ({ isOpen, onClose, onConfirm, employee, loading }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          <RiAlertLine className="confirm-icon" />
        </div>
        <h2 className="confirm-title">Delete Employee?</h2>
        <p className="confirm-msg">
          Are you sure you want to delete{' '}
          <strong>{employee.firstName} {employee.lastName}</strong>? This action cannot be undone.
        </p>
        <div className="confirm-footer">
          <button className="btn-secondary" onClick={onClose}>
            <RiCloseLine /> Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <><div className="btn-spinner"></div> Deleting...</>
            ) : (
              <><RiDeleteBinLine /> Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
