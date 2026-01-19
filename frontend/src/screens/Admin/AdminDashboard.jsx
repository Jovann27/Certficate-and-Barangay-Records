import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import BusinessPermitCertificate from "../certificates/BusinessPermitCertificate";
import Logo from "../../assets/kalusugan.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboard({ onLogout, onNavigate }) {
  const [stats, setStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [timePeriod, setTimePeriod] = useState("This year");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchMonthlyStats();
  }, [timePeriod]);

  const fetchStats = async () => {
    if (loading) return; // Prevent multiple simultaneous calls

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
        toast.success('Statistics loaded successfully');
      } else {
        toast.error('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error fetching statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(`http://localhost:3001/api/monthly-stats?year=${currentYear}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMonthlyStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  // Prepare data for charts from actual monthly database stats
  const documentStats = monthlyStats.length > 0 ? monthlyStats.map(stat => ({
    month: stat.month,
    value: stat.total
  })) : [
    { month: 'JAN', value: 0 },
    { month: 'FEB', value: 0 },
    { month: 'MAR', value: 0 },
    { month: 'APR', value: 0 },
    { month: 'MAY', value: 0 },
    { month: 'JUN', value: 0 },
    { month: 'JUL', value: 0 },
    { month: 'AUG', value: 0 },
    { month: 'SEP', value: 0 },
    { month: 'OCT', value: 0 },
    { month: 'NOV', value: 0 },
    { month: 'DEC', value: 0 }
  ];

  const totalPopulation = stats.barangay_inhabitants?.total || 0;
  const voterCount = stats.barangay_inhabitants?.voter_count || 0;
  const nonVoterCount = totalPopulation - voterCount;

  const employmentData = [
    { name: 'Employed', value: Math.round(((stats.personal_details?.total || 0) + (stats.kasambahay?.total || 0)) / Math.max((stats.personal_details?.total || 0) + (stats.kasambahay?.total || 0) + (stats.barangay_inhabitants?.total || 0), 1) * 100) },
    { name: 'Unemployed', value: Math.round((stats.barangay_inhabitants?.total || 0) / Math.max((stats.personal_details?.total || 0) + (stats.kasambahay?.total || 0) + (stats.barangay_inhabitants?.total || 0), 1) * 100) }
  ];

  const pwdData = [
    { name: 'PWD Residents', value: Math.round((stats.personal_details?.pwd_count || 0) / Math.max(stats.barangay_inhabitants?.total || 1, 1) * 100) },
    { name: 'Non-PWD', value: Math.round(((stats.barangay_inhabitants?.total || 0) - (stats.personal_details?.pwd_count || 0)) / Math.max(stats.barangay_inhabitants?.total || 1, 1) * 100) }
  ];

  const handleBackupData = async () => {
    try {
      toast.info('Preparing backup data...');

      const response = await fetch('/api/backup-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `barangay-backup-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Backup data downloaded successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error(`Error creating backup data: ${error.message}`);
    }
  };

  const COLORS = ['#0066CC', '#E8E8E8'];
  const PWD_COLORS = ['#4A90E2', '#7FB3E5', '#A8D8EA', '#FFD700', '#F8B195'];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow border-b-4 border-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-lg">
            <img src={Logo} alt="" />
          </div>
          <span className="font-semibold text-lg">Barangay Kulusugan</span>
        </div>

        <nav className="flex gap-8 text-gray-600">
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600" onClick={() => onNavigate('admin-dashboard')}>Dashboard</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('barangay-inhabitants-list')}>Records</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('certificate-logs')}>Certificate Logs</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-users')}>User Management</span>
        </nav>

        <div className="text-sm flex items-center gap-3">
          <span>Admin User</span>
          <button onClick={onLogout} className="text-red-500 cursor-pointer hover:text-red-700 text-lg">
            ⎋
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-8 bg-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Overview</h2>

          <div className="flex gap-4 items-center">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md bg-white text-sm"
            >
              <option>This year</option>
              <option>Last year</option>
              <option>This month</option>
              <option>Last month</option>
            </select>

            <button
              onClick={handleBackupData}
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 font-medium text-sm"
            >
              💾 Backup Data
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Residential Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Residential</h4>
            <p className="text-gray-500 text-xs mb-4">Total Population</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{totalPopulation}</div>
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Voters: <strong>{voterCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span>Non-Voters: <strong>{nonVoterCount}</strong></span>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 min-w-[128px] min-h-[128px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={128} minHeight={128}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Voters', value: voterCount || 0 },
                        { name: 'Non-Voters', value: nonVoterCount || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      <Cell fill="#0066CC" />
                      <Cell fill="#FFB3D9" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Employment Status Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Employment Status</h4>
            <div className="w-full h-40 min-w-48">
              <ResponsiveContainer width="100%" height="100%" minWidth={192} minHeight={160}>
                <PieChart>
                  <Pie
                    data={employmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                  >
                    <Cell fill="#7C5FD8" />
                    <Cell fill="#E0E0E0" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Employed</span>
                <strong>{employmentData[0]?.value || 0}%</strong>
              </div>
              <div className="flex justify-between">
                <span>Unemployed</span>
                <strong>{employmentData[1]?.value || 0}%</strong>
              </div>
            </div>
          </div>

          {/* Housekeeper Status Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Housekeeper</h4>
            <p className="text-gray-500 text-xs mb-4">Status</p>
            <div className="text-3xl font-bold text-gray-800 mb-4">{stats.kasambahay?.total || 0}</div>
            <div className="flex items-end justify-between h-20">
              <div className="flex-1 bg-blue-300 h-4 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-300 h-8 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-400 h-12 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-500 h-16 mx-1 rounded"></div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs text-green-600 font-medium">{Math.round((stats.kasambahay?.full_time_count || 0) / Math.max(stats.kasambahay?.total || 1, 1) * 100)}% Full-time</span>
            </div>
          </div>

          {/* Senior Citizen Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Senior Citizen</h4>
            <p className="text-gray-500 text-xs mb-4">Total Count</p>
            <div className="text-3xl font-bold text-gray-800">{stats.personal_details?.senior_citizen_count || 0}</div>
            <div className="mt-2 text-xs text-gray-600">
              Based on certificate applicants aged 60+
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-3 gap-6">
          {/* Statistic of Documents */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistic of Documents</h3>
            <div className="w-full h-72 min-w-96">
              <ResponsiveContainer width="100%" height="100%" minWidth={384} minHeight={288}>
                <BarChart data={documentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0066CC" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PWD Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              PWD Distribution by Type
              <span className="block text-sm text-gray-600 font-normal mt-1">Total <strong>{stats.personal_details?.pwd_count || 0}</strong></span>
            </h3>
            <div className="space-y-3 text-sm">
              {pwdData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-800">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${item.value}%`, backgroundColor: PWD_COLORS[idx] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
