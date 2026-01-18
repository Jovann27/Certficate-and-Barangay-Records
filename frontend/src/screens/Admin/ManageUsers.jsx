import React, { useState, useEffect } from 'react';
import Logo from '../../assets/kalusugan.png';

const ManageUsers = ({ onNavigate, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff'
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        setMessage('Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setMessage('Error fetching users');
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

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'staff'
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't prefill password
      role: user.role
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'staff'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');

      if (modalMode === 'add') {
        // Add new user
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setMessage('User created successfully');
          fetchUsers(); // Refresh list
          closeModal();
        } else {
          const error = await response.json();
          setMessage(error.message || 'Failed to create user');
        }
      } else {
        // Edit user
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };

        // Include password only if provided
        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password;
        }

        const response = await fetch(`/api/auth/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          setMessage('User updated successfully');
          fetchUsers();
          closeModal();
        } else {
          const error = await response.json();
          setMessage(error.message || 'Failed to update user');
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Error submitting form');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('User deactivated successfully');
        fetchUsers();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Error deactivating user');
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
          <span className="font-semibold text-black cursor-pointer hover:text-blue-600" onClick={() => onNavigate('manage-users')}>User Management</span>
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
              <h2 className="text-xl font-semibold">👥 Manage Users</h2>
              <button
                onClick={openAddModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add User
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
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
              {modalMode === 'add' ? 'Add New User' : 'Edit User'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={modalMode === 'edit'} // Don't allow username change on edit
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required={modalMode === 'add'}
                  placeholder={modalMode === 'edit' ? 'Leave blank to keep current password' : ''}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
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
                  {formLoading ? 'Saving...' : (modalMode === 'add' ? 'Add User' : 'Update User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
