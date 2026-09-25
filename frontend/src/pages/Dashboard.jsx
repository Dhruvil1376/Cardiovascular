import React from 'react';
import StatCard from '../components/StatCard';
import { Database, Heart, Activity, User, Ruler, Weight, PieChart as PieIcon, BarChart as BarIcon } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const DATASET_STATS = {
  totalRecords: 70000,
  positiveCount: 34979,
  negativeCount: 35021,
  positivePercentage: 50.0,
  negativePercentage: 50.0,
  avgAgeYears: 53.3,
  avgHeight: 164.4,
  avgWeight: 74.2,
  avgApHi: 128.8,
  avgApLo: 96.6,
  genderDistribution: [
    { name: 'Female', count: 45530, percentage: 65.0, fill: '#ec4899' },
    { name: 'Male', count: 24470, percentage: 35.0, fill: '#3b82f6' },
  ],
  cholesterolDistribution: [
    { level: 'Normal (1)', count: 52385, percentage: 74.8, fill: '#10b981' },
    { level: 'Above Normal (2)', count: 9549, percentage: 13.6, fill: '#f59e0b' },
    { level: 'Well Above Normal (3)', count: 8066, percentage: 11.5, fill: '#ef4444' },
  ],
  glucoseDistribution: [
    { level: 'Normal (1)', count: 59479, percentage: 85.0, fill: '#10b981' },
    { level: 'Above Normal (2)', count: 5190, percentage: 7.4, fill: '#f59e0b' },
    { level: 'Well Above Normal (3)', count: 5331, percentage: 7.6, fill: '#ef4444' },
  ],
  cardioDistribution: [
    { status: 'Low Risk (0)', count: 35021, fill: '#10b981' },
    { status: 'High Risk (1)', count: 34979, fill: '#ef4444' },
  ]
};

export const Dashboard = () => {
  const stats = DATASET_STATS;

  // Custom colors for charts
  const CARDIO_COLORS = ['#10b981', '#ef4444'];
  const GENDER_COLORS = ['#ec4899', '#3b82f6'];

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Dataset Analytics Dashboard</h2>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
          Statistical summary and charts generated from 70,000 dataset records (<code>cardio_train.csv</code>).
        </p>
      </div>

      {/* METRIC STAT CARDS GRID */}
      <div className="stats-grid">
        <StatCard
          title="Total Records"
          value={stats.totalRecords.toLocaleString()}
          subtitle="Complete Dataset Size"
          icon={Database}
          color="#2563eb"
          bgLight="#eff6ff"
        />

        <StatCard
          title="Cardio Positive"
          value={stats.positiveCount.toLocaleString()}
          subtitle={`${stats.positivePercentage}% of subjects`}
          icon={Heart}
          color="#ef4444"
          bgLight="#fef2f2"
        />

        <StatCard
          title="Cardio Negative"
          value={stats.negativeCount.toLocaleString()}
          subtitle={`${stats.negativePercentage}% of subjects`}
          icon={Activity}
          color="#10b981"
          bgLight="#ecfdf5"
        />

        <StatCard
          title="Average Age"
          value={`${stats.avgAgeYears} yrs`}
          subtitle="Converted from days"
          icon={User}
          color="#d97706"
          bgLight="#fffbeb"
        />

        <StatCard
          title="Average Height"
          value={`${stats.avgHeight} cm`}
          subtitle="Mean subject height"
          icon={Ruler}
          color="#8b5cf6"
          bgLight="#f5f3ff"
        />

        <StatCard
          title="Average Weight"
          value={`${stats.avgWeight} kg`}
          subtitle="Mean subject weight"
          icon={Weight}
          color="#06b6d4"
          bgLight="#ecfeff"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        {/* Chart 1: Cardiovascular Disease Outcome Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieIcon size={20} style={{ color: '#ef4444' }} />
            <h3>Cardiovascular Disease Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.cardioDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {stats.cardioDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARDIO_COLORS[index % CARDIO_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString() + ' subjects', 'Count']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Gender Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarIcon size={20} style={{ color: '#2563eb' }} />
            <h3>Gender Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={stats.genderDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value) => [value.toLocaleString() + ' subjects', 'Count']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Cholesterol Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarIcon size={20} style={{ color: '#d97706' }} />
            <h3>Cholesterol Level Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={stats.cholesterolDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value) => [value.toLocaleString() + ' subjects', 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {stats.cholesterolDistribution.map((entry, index) => (
                    <Cell key={`cell-chol-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Glucose Distribution */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarIcon size={20} style={{ color: '#059669' }} />
            <h3>Glucose Level Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={stats.glucoseDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(value) => [value.toLocaleString() + ' subjects', 'Count']} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]}>
                  {stats.glucoseDistribution.map((entry, index) => (
                    <Cell key={`cell-gluc-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
