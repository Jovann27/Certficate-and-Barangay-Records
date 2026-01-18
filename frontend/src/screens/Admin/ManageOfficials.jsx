import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Logo from '../../assets/kalusugan.png';

const ManageOfficials = ({ onNavigate, onLogout }) => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    committee: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch officials on component mount
  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/officials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOfficials(data.data);
      } else {
        toast.error('Failed to fetch officials');
      }
    } catch (error) {
      console.error('Fetch officials error:', error);
      toast.error('Error fetching officials');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openEditModal = (official) => {
    setEditingOfficial(official);
    setFormData({
      name: official.name,
      title: official.title,
      committee: official.committee || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingOfficial(null);
    setFormData({
      name: '',
      title: '',
      committee: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/officials/${editingOfficial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Official updated successfully');
        fetchOfficials(); // Refresh list
        closeModal();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update official');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Error updating official');
    } finally {
      setFormLoading(false);
    }
  };

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
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('admin-dashboard')}>Dashboard</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('barangay-inhabitants-list')}>Records</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-users')}>User Management</span>
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-officials')}>Officials</span>
        </nav>

        <div className="text-sm flex items-center gap-3">
          <span>Admin User</span>
          <button onClick={onLogout} className="text-red-500 cursor-pointer hover:text-red-700 text-lg">
            ⎋
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => onNavigate('admin-dashboard')} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">← Back to Dashboard</button>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">🏛️ Manage Barangay Officials</h2>
              <p className="text-sm text-gray-600">Edit official names that appear on certificates</p>
            </div>



            {loading ? (
              <div className="text-center py-8">Loading officials...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {officials.map((official) => (
                      <tr key={official.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {official.position}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {official.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {official.title}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {official.committee || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(official)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Edit Official: {editingOfficial?.position}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Committee (optional)
                </label>
                <input
                  type="text"
                  name="committee"
                  value={formData.committee}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Committee on Finance"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Update Official'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOfficials;
