import React, { useState, useEffect } from 'react';

const Dashboard = ({ onNavigate, onLogout }) => {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, []);

  const fetchRecords = async (search = '', limit = 50) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('limit', limit.toString());

      const response = await fetch(`http://localhost:3001/api/records?${params}`);
      const result = await response.json();
      if (result.success) {
        setRecords(result.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords(searchTerm);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
    // Apply filter logic here if needed
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">{change}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, onClick, color = "bg-blue-50 hover:bg-blue-100" }) => (
    <div
      onClick={onClick}
      className={`${color} rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-200`}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barangay Kalusugan</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Staff User</p>
                <p className="text-xs text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
              <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Staff! 👋</h2>
          <p className="text-gray-600">Here's what's happening in Barangay Kalusugan today.</p>
        </div>

        {/* Statistics Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Residents"
              value={stats.personal_details?.total || 0}
              icon="👥"
              color="border-l-blue-500"
              change="+12% from last month"
            />
            <StatCard
              title="Business Permits"
              value={stats.kasambahay?.total || 0}
              icon="💼"
              color="border-l-green-500"
              change="+8% from last month"
            />
            <StatCard
              title="Barangay Records"
              value={stats.barangay_inhabitants?.total || 0}
              icon="📋"
              color="border-l-purple-500"
              change="+15% from last month"
            />
            <StatCard
              title="Total Records"
              value={stats.total_records || 0}
              icon="📊"
              color="border-l-orange-500"
              change="+10% from last month"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="New Resident Registration"
              description="Register new barangay residents"
              icon="👤"
              onClick={() => onNavigate('personal')}
            />
            <QuickActionCard
              title="Business Permit Application"
              description="Apply for barangay business permit"
              icon="🏢"
              onClick={() => onNavigate('business')}
              color="bg-yellow-50 hover:bg-yellow-100"
            />
            <QuickActionCard
              title="Barangay Records"
              description="Record of Barangay Inhabitants"
              icon="📝"
              onClick={() => onNavigate('rbi')}
              color="bg-purple-50 hover:bg-purple-100"
            />
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Recent Records</h3>
              <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search records..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </form>
                <select
                  value={filter}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="personal">Personal Details</option>
                  <option value="business">Business Permit</option>
                  <option value="kasambahay">Kasambahay</option>
                  <option value="rbi">Barangay Records</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading records...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Address</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date Issued</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length > 0 ? (
                      records.slice(0, 10).map((record, index) => (
                        <tr key={record.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 font-medium">{record.name}</td>
                          <td className="py-3 px-4 text-gray-600">{record.address}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.type === 'Personal Details' ? 'bg-blue-100 text-blue-800' :
                              record.type === 'Kasambahay' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {record.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(record.date_issued).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 px-4 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <span className="text-4xl mb-2">📋</span>
                            <p>No records found</p>
                            <p className="text-sm text-gray-400 mt-1">New records will appear here</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
