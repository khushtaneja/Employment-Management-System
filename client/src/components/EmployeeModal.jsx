import { useState, useEffect } from 'react';
import { RiCloseLine, RiSaveLine, RiUserLine } from 'react-icons/ri';
import { createEmployee, updateEmployee } from '../api/employees';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

const defaultForm = {
  firstName: '',
  lastName: '',
  email: '',
  department: 'Engineering',
  position: '',
  salary: '',
  dateOfJoining: '',
  isActive: true,
};

const EmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        dateOfJoining: employee.dateOfJoining
          ? new Date(employee.dateOfJoining).toISOString().split('T')[0]
          : '',
        isActive: employee.isActive,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!form.salary && form.salary !== 0) newErrors.salary = 'Salary is required';
    else if (isNaN(form.salary) || form.salary < 0) newErrors.salary = 'Invalid salary';
    if (!form.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: parseFloat(form.salary),
      };

      if (isEdit) {
        await updateEmployee(employee._id, payload);
        toast.success('Employee updated successfully!');
      } else {
        await createEmployee(payload);
        toast.success('Employee added successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <RiUserLine />
            </div>
            <div>
              <h2 className="modal-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
              <p className="modal-subtitle">
                {isEdit ? 'Update employee information' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <RiCloseLine />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
              />
              {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
            </div>
            <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
              {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john.doe@company.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className={`form-group ${errors.position ? 'error' : ''}`}>
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Software Engineer"
              />
              {errors.position && <span className="error-msg">{errors.position}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${errors.salary ? 'error' : ''}`}>
              <label>Salary (USD) *</label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="75000"
                min="0"
                max="10000000"
              />
              {errors.salary && <span className="error-msg">{errors.salary}</span>}
            </div>
            <div className={`form-group ${errors.dateOfJoining ? 'error' : ''}`}>
              <label>Date of Joining *</label>
              <input
                type="date"
                name="dateOfJoining"
                value={form.dateOfJoining}
                onChange={handleChange}
              />
              {errors.dateOfJoining && <span className="error-msg">{errors.dateOfJoining}</span>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <span className="checkbox-custom"></span>
              <span>Active Employee</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  {isEdit ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <RiSaveLine />
                  {isEdit ? 'Update Employee' : 'Add Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
