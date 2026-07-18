import { useEffect, useState } from 'react';
import { RiUserAddLine, RiRefreshLine } from 'react-icons/ri';
import { getEmployees, deleteEmployee } from '../api/employees';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setConfirmOpen(true);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEmployee(selectedEmployee._id);
      toast.success('Employee deleted successfully');
      setConfirmOpen(false);
      setSelectedEmployee(null);
      await fetchEmployees();
    } catch {
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${employees.length} total employees`}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchEmployees} disabled={loading}>
            <RiRefreshLine className={loading ? 'spin' : ''} />
            Refresh
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAddNew}>
              <RiUserAddLine />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <EmployeeTable
        employees={employees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedEmployee(null); }}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedEmployee(null); }}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
        loading={deleteLoading}
      />
    </div>
  );
};

export default EmployeesPage;
