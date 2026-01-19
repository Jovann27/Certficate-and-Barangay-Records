import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function CertificateLogs({ onNavigate, onLogout }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/certificate-logs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        toast.error('Failed to load certificate logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Error fetching certificate logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Certificate of Residency':
        return '🏠';
      case 'Business Permit Certificate':
        return '💼';
      case 'Certificate of Indigency':
        return '📄';
      case 'Certificate of Employment':
        return '👔';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Certificate of Residency':
        return 'bg-blue-100 text-blue-800';
      case 'Business Permit Certificate':
        return 'bg-green-100 text-green-800';
      case 'Certificate of Indigency':
        return 'bg-orange-100 text-orange-800';
      case 'Certificate of Employment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading certificate logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow border-b-4 border-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ◆
          </div>
          <span className="font-semibold text-lg">Barangay Kalusugan</span>
        </div>

        <nav className="flex gap-8 text-gray-600">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('admin-dashboard')}>Dashboard</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('barangay-inhabitants-list')}>Records</span>
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600" onClick={() => onNavigate('certificate-logs')}>Certificate Logs</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-users')}>User Management</span>
        </nav>

        <div className="text-sm flex items-center gap-3">
          <span>Admin User</span>
          <button onClick={onLogout} className="text-red-500 cursor-pointer hover:text-red-700 text-lg">
            ⎋
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Certificate Logs</h1>
          <button
            onClick={fetchLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name or certificate type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Filter by type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Certificate of Residency">Certificate of Residency</option>
              <option value="Business Permit Certificate">Business Permit Certificate</option>
              <option value="Certificate of Indigency">Certificate of Indigency</option>
              <option value="Certificate of Employment">Certificate of Employment</option>
            </select>
          </div>
        </div>

        {/* LOGS LIST */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Issued Certificates ({filteredLogs.length})
            </h2>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No certificate logs found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <div key={`${log.id}-${log.type}`} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">
                          {getTypeIcon(log.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{log.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                              {log.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{log.address}</div>
                          <div className="text-xs text-gray-500">
                            Issued on: {new Date(log.date_issued).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">{log.category}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {log.id}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{logs.filter(l => l.type === 'Certificate of Residency').length}</div>
            <div className="text-sm text-gray-600">Residency Certificates</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">{logs.filter(l => l.type === 'Business Permit Certificate').length}</div>
            <div className="text-sm text-gray-600">Business Permits</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-orange-600">{logs.filter(l => l.type === 'Certificate of Indigency').length}</div>
            <div className="text-sm text-gray-600">Indigency Certificates</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-600">{logs.filter(l => l.type === 'Certificate of Employment').length}</div>
            <div className="text-sm text-gray-600">Employment Certificates</div>
          </div>
        </div>
      </main>
    </div>
  );
}
