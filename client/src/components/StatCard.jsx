const StatCard = ({ icon, label, value, color, subtitle }) => {
  return (
    <div className="stat-card" style={{ '--card-accent': color }}>
      <div className="stat-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
      <div className="stat-glow" style={{ background: color }}></div>
    </div>
  );
};

export default StatCard;
