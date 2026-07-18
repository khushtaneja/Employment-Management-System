import { useEffect, useState } from 'react';
import {
  RiTeamLine,
  RiUserFollowLine,
  RiMoneyDollarCircleLine,
  RiBuildingLine,
  RiBarChartBoxLine,
} from 'react-icons/ri';
import { getEmployees } from '../api/employees';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const DEPT_COLORS = {
  Engineering: '#818cf8',
  HR: '#f472b6',
  Finance: '#34d399',
  Marketing: '#fbbf24',
  Operations: '#22d3ee',
};

const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch {
        // handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.isActive).length;
  const avgSalary =
    employees.length > 0
      ? Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length)
      : 0;
  const departments = [...new Set(employees.map((e) => e.department))].length;

  const deptBreakdown = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'].map((dept) => ({
    name: dept,
    count: employees.filter((e) => e.department === dept).length,
    color: DEPT_COLORS[dept],
  }));

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.createdAt || b.dateOfJoining) - new Date(a.createdAt || a.dateOfJoining))
    .slice(0, 5);

  const formatSalary = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <span className="highlight">{user?.username}</span> 👋
          </p>
        </div>
        <div className="page-badge">
          <RiBarChartBoxLine />
          Live Overview
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={<RiTeamLine />}
          label="Total Employees"
          value={loading ? '—' : totalEmployees}
          color="var(--accent-purple)"
          subtitle="All registered"
        />
        <StatCard
          icon={<RiUserFollowLine />}
          label="Active Employees"
          value={loading ? '—' : activeEmployees}
          color="var(--accent-green)"
          subtitle={`${loading ? '—' : totalEmployees - activeEmployees} inactive`}
        />
        <StatCard
          icon={<RiMoneyDollarCircleLine />}
          label="Avg. Salary"
          value={loading ? '—' : formatSalary(avgSalary)}
          color="var(--accent-yellow)"
          subtitle="Per employee/year"
        />
        <StatCard
          icon={<RiBuildingLine />}
          label="Departments"
          value={loading ? '—' : departments}
          color="var(--accent-cyan)"
          subtitle="Active departments"
        />
      </div>

      <div className="dashboard-grid">
        {/* Department Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Department Overview</h3>
          </div>
          <div className="dept-list">
            {deptBreakdown.map((dept) => {
              const pct = totalEmployees > 0 ? (dept.count / totalEmployees) * 100 : 0;
              return (
                <div key={dept.name} className="dept-row">
                  <div className="dept-info">
                    <span className="dept-dot" style={{ background: dept.color }}></span>
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-count">{dept.count}</span>
                  </div>
                  <div className="dept-bar-wrap">
                    <div
                      className="dept-bar"
                      style={{ width: `${pct}%`, background: dept.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Employees */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Employees</h3>
          </div>
          <div className="recent-list">
            {loading ? (
              <div className="list-loading">
                <div className="spinner"></div>
              </div>
            ) : recentEmployees.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No employees yet</p>
            ) : (
              recentEmployees.map((emp) => {
                const deptColor = DEPT_COLORS[emp.department] || '#94a3b8';
                return (
                  <div key={emp._id} className="recent-row">
                    <div
                      className="recent-avatar"
                      style={{ background: `${deptColor}22`, color: deptColor }}
                    >
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div className="recent-info">
                      <span className="recent-name">{emp.firstName} {emp.lastName}</span>
                      <span className="recent-role">{emp.position}</span>
                    </div>
                    <span className="recent-dept" style={{ color: deptColor }}>
                      {emp.department}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
