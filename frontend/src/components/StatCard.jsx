import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#2563eb', bgLight = '#eff6ff' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgLight, color: color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
