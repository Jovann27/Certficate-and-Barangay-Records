import React, { useState, useEffect } from "react";
import BusinessPermitCertificate from "./certificates/BusinessPermitCertificate";
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

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({});
  const [timePeriod, setTimePeriod] = useState("This year");

  useEffect(() => {
    fetchStats();
  }, [timePeriod]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Mock data for charts
  const documentStats = [
    { month: 'JAN', value: 65 },
    { month: 'FEB', value: 30 },
    { month: 'MAR', value: 42 },
    { month: 'APR', value: 95 },
    { month: 'MAY', value: 88 },
    { month: 'JUN', value: 78 },
    { month: 'JUL', value: 82 },
    { month: 'AUG', value: 85 },
    { month: 'SEP', value: 55 },
    { month: 'OCT', value: 75 },
    { month: 'NOV', value: 68 },
    { month: 'DEC', value: 60 }
  ];

  const employmentData = [
    { name: 'Employed', value: 88 },
    { name: 'Unemployed', value: 12 }
  ];

  const pwdData = [
    { name: 'Visual Impairment', value: 66 },
    { name: 'Physical Disability', value: 18 },
    { name: 'Hearing Impairment', value: 12 },
    { name: 'Mental/Psychosocial', value: 3 },
    { name: 'Others', value: 2 }
  ];

  const COLORS = ['#0066CC', '#E8E8E8'];
  const PWD_COLORS = ['#4A90E2', '#7FB3E5', '#A8D8EA', '#FFD700', '#F8B195'];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow border-b-4 border-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ◆
          </div>
          <span className="font-semibold text-lg">Barangay Kulumsan</span>
        </div>

        <nav className="flex gap-8 text-gray-600">
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600">Dashboard</span>
          <span className="cursor-pointer hover:text-blue-600">User Profile</span>
          <span className="cursor-pointer hover:text-blue-600">Documents</span>
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

            <button className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800 font-medium text-sm">
              + Import Data
            </button>

            <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 font-medium text-sm">
              ⬇ Export Data
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
                <div className="text-3xl font-bold text-gray-800">504</div>
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Voters: <strong>471</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span>Non-Voters: <strong>170</strong></span>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Voters', value: 471 },
                        { name: 'Non-Voters', value: 170 }
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Employment Status Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Employment Status</h4>
            <div className="flex items-center justify-center h-40">
              <ResponsiveContainer width="100%" height="100%">
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
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Employed</span>
                <strong>88%</strong>
              </div>
              <div className="flex justify-between">
                <span>Unemployed</span>
                <strong>12%</strong>
              </div>
            </div>
          </div>

          {/* Housekeeper Status Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Housekeeper</h4>
            <p className="text-gray-500 text-xs mb-4">Status</p>
            <div className="text-3xl font-bold text-gray-800 mb-4">105</div>
            <div className="flex items-end justify-between h-20">
              <div className="flex-1 bg-blue-300 h-4 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-300 h-8 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-400 h-12 mx-1 rounded"></div>
              <div className="flex-1 bg-blue-500 h-16 mx-1 rounded"></div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-xs text-green-600 font-medium">12% ↑</span>
            </div>
          </div>

          {/* Senior Citizen Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-gray-600 text-sm font-medium mb-4">Senior Citizen</h4>
            <p className="text-gray-500 text-xs mb-4">Total Count</p>
            <div className="text-3xl font-bold text-gray-800">70</div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-3 gap-6">
          {/* Statistic of Documents */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistic of Documents</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={documentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#0066CC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PWD Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              PWD Distribution by Type
              <span className="block text-sm text-gray-600 font-normal mt-1">Total <strong>109</strong></span>
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
