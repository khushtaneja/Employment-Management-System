import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  RiArrowLeftLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiBuildingLine,
  RiBriefcaseLine,
} from 'react-icons/ri';
import { getEmployee, deleteEmployee } from '../api/employees';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEPT_COLORS = {
  Engineering: '#818cf8',
  HR: '#f472b6',
  Finance: '#34d399',
  Marketing: '#fbbf24',
  Operations: '#22d3ee',
};

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployee = async () => {
    try {
      const data = await getEmployee(id);
      setEmployee(data);
    } catch {
      toast.error('Employee not found');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted');
      navigate('/employees');
    } catch {
      toast.error('Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatSalary = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatDate = (val) =>
    new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const deptColor = DEPT_COLORS[employee.department] || '#94a3b8';

  const details = [
    { icon: <RiMailLine />, label: 'Email', value: employee.email },
    { icon: <RiBuildingLine />, label: 'Department', value: employee.department },
    { icon: <RiBriefcaseLine />, label: 'Position', value: employee.position },
    { icon: <RiMoneyDollarCircleLine />, label: 'Salary', value: formatSalary(employee.salary) },
    { icon: <RiCalendarLine />, label: 'Date of Joining', value: formatDate(employee.dateOfJoining) },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div className="back-row">
          <Link to="/employees" className="back-btn">
            <RiArrowLeftLine /> Back to Employees
          </Link>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-hero" style={{ '--dept-color': deptColor }}>
          <div className="detail-avatar" style={{ background: `${deptColor}22`, color: deptColor }}>
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div className="detail-hero-info">
            <h2 className="detail-name">{employee.firstName} {employee.lastName}</h2>
            <p className="detail-position">{employee.position}</p>
            <div className="detail-badges">
              <span className="dept-badge" style={{ background: `${deptColor}22`, color: deptColor }}>
                {employee.department}
              </span>
              <span className={`status-pill ${employee.isActive ? 'active' : 'inactive'}`}>
                <span className="status-dot"></span>
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {isAdmin && (
            <div className="detail-actions">
              <button className="btn-secondary" onClick={() => setModalOpen(true)}>
                <RiEditLine /> Edit
              </button>
              <button className="btn-danger" onClick={() => setConfirmOpen(true)}>
                <RiDeleteBinLine /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="detail-body">
          {details.map((d) => (
            <div key={d.label} className="detail-row">
              <div className="detail-icon" style={{ color: deptColor }}>
                {d.icon}
              </div>
              <div className="detail-field">
                <span className="detail-label">{d.label}</span>
                <span className="detail-value">{d.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={employee}
        onSuccess={fetchEmployee}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        employee={employee}
        loading={deleteLoading}
      />
    </div>
  );
};

export default EmployeeDetailPage;
