import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiEditLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiFilterLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiUserLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const DEPT_COLORS = {
  Engineering: { bg: '#6366f122', color: '#818cf8' },
  HR: { bg: '#ec489922', color: '#f472b6' },
  Finance: { bg: '#10b98122', color: '#34d399' },
  Marketing: { bg: '#f59e0b22', color: '#fbbf24' },
  Operations: { bg: '#06b6d422', color: '#22d3ee' },
};

const EmployeeTable = ({ employees, onEdit, onDelete, loading }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('firstName');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const filtered = employees
    .filter((e) => {
      const name = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchSearch =
        name.includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase());
      const matchDept = !deptFilter || e.department === deptFilter;
      const matchStatus =
        statusFilter === '' ||
        (statusFilter === 'active' && e.isActive) ||
        (statusFilter === 'inactive' && !e.isActive);
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon inactive">⇅</span>;
    return sortDir === 'asc' ? (
      <RiArrowUpLine className="sort-icon active" />
    ) : (
      <RiArrowDownLine className="sort-icon active" />
    );
  };

  const formatSalary = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatDate = (val) =>
    new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

  return (
    <div className="table-container">
      {/* Filters */}
      <div className="table-controls">
        <div className="search-box">
          <RiSearchLine className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, position..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />
        </div>
        <div className="filters">
          <div className="filter-select-wrap">
            <RiFilterLine className="filter-icon" />
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="emp-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')} className="sortable">
                Employee <SortIcon field="firstName" />
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department <SortIcon field="department" />
              </th>
              <th onClick={() => handleSort('position')} className="sortable">
                Position <SortIcon field="position" />
              </th>
              <th onClick={() => handleSort('salary')} className="sortable">
                Salary <SortIcon field="salary" />
              </th>
              <th onClick={() => handleSort('dateOfJoining')} className="sortable">
                Joined <SortIcon field="dateOfJoining" />
              </th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="table-loading">
                  <div className="spinner"></div>
                  <span>Loading employees...</span>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="table-empty">
                  <RiUserLine className="empty-icon" />
                  <p>No employees found</p>
                </td>
              </tr>
            ) : (
              paginated.map((emp) => {
                const deptStyle = DEPT_COLORS[emp.department] || { bg: '#ffffff11', color: '#94a3b8' };
                return (
                  <tr key={emp._id} className="table-row" onClick={() => navigate(`/employees/${emp._id}`)}>
                    <td>
                      <div className="emp-cell">
                        <div className="emp-avatar" style={{ background: deptStyle.bg, color: deptStyle.color }}>
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <div className="emp-name">{emp.firstName} {emp.lastName}</div>
                          <div className="emp-email">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="dept-badge" style={{ background: deptStyle.bg, color: deptStyle.color }}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="text-muted">{emp.position}</td>
                    <td className="salary-cell">{formatSalary(emp.salary)}</td>
                    <td className="text-muted">{formatDate(emp.dateOfJoining)}</td>
                    <td>
                      <span className={`status-pill ${emp.isActive ? 'active' : 'inactive'}`}>
                        <span className="status-dot"></span>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="action-btns" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="action-btn edit"
                            onClick={() => onEdit(emp)}
                            title="Edit employee"
                          >
                            <RiEditLine />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => onDelete(emp)}
                            title="Delete employee"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="page-info">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="page-btns">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="page-btn">
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`page-btn ${p === page ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="page-btn">
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
