import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Search, Edit, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../controllers/authcontext.jsx';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const {token, initialized, logout } = useContext(AuthContext);


  useEffect(() => {
    if (initialized) {
      fetchUsers();
    }
  }, [initialized, token]);

  const fetchUsers = async () => {
    try {
      if (!token) {
        console.error('No token available - redirecting to login');
        logout();
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        logout();
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error - could not connect to server');
      }
    }
  };

  const filteredUsers = users?.filter(user => {
    const full_name = user?.full_name || '';
    const email = user?.email || '';
    
    const matchesSearch = full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user?.user_type?.toLowerCase() === filterRole.toLowerCase() || user?.account_status === filterRole;
    const matchesStatus = filterStatus === '' || user?.account_status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleBulkRoleChange = (newRole) => {
    setUsers(users.map(user => 
      selectedUsers.includes(user._id) ? { ...user, user_type: newRole } : user
    ));
    setSelectedUsers([]);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_status: newStatus })
      });
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const handleStatusChange = (userId, e) => {
    const newStatus = e.target.value;
    updateUserStatus(userId, newStatus);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Confirmed' ? 'Pending' : 'Confirmed';
    await updateUserStatus(userId, newStatus);
  };

  const promoteToFacultyAdmin = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_status: 'Faculty Admin' })
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to promote user:', err);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userToDelete._id}`);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] p-4 mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-white hover:text-[#de9e28] border border-white/30 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md shadow-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#de9e28]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select 
              className="border border-white/30 rounded-lg px-4 py-2 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#de9e28]"
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="" className="bg-gray-700">All Roles</option>
              <option value="Driver" className="bg-gray-700">Driver</option>
              <option value="Guard" className="bg-gray-700">Guard</option>
              <option value="Student" className="bg-gray-700">Student</option>
              <option value="Lecturer" className="bg-gray-700">Lecturer</option>
              <option value="nonacademic" className="bg-gray-700">Non-Academic</option>
              <option value="Faculty Admin" className="bg-gray-700">Faculty Admins</option>
            </select>
            <select 
              className="border border-white/30 rounded-lg px-4 py-2 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#de9e28]"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="" className="bg-gray-700">All Status</option>
              <option value="Confirmed" className="bg-gray-700">Confirmed</option>
              <option value="Pending" className="bg-gray-700">Pending</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-4 py-2 text-left">Select</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id} className="border-t border-white/20 hover:bg-white/5">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        className="rounded text-[#800000] focus:ring-[#de9e28]"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user._id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">{user.full_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.user_type}</td>
                    <td className="px-4 py-2">
                      {editingUser === user._id ? (
                        <select
                          value={user.account_status}
                          onChange={(e) => handleStatusChange(user._id, e)}
                          className="bg-gray-800 text-white rounded px-2 py-1"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Pending">Pending</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          user.account_status === 'Confirmed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {user.account_status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          onClick={() => setEditingUser(editingUser === user._id ? null : user._id)}
                          title="Edit User Status"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {user.account_status === 'Pending' && (
                          <button 
                            className="text-green-300 hover:text-green-400 transition-colors" 
                            onClick={() => toggleUserStatus(user._id, user.account_status)}
                            title="Confirm User"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                        )}
                        {user.user_type === 'lecturer' && user.account_status === 'Confirmed' && (
                          <button 
                            className="text-purple-300 hover:text-purple-400 transition-colors" 
                            onClick={() => promoteToFacultyAdmin(user._id)}
                            title="Promote to Faculty Admin"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          className="text-red-300 hover:text-red-400 transition-colors" 
                          onClick={() => confirmDelete(user)}
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-red-600 flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600 mr-2" /> Delete User
            </h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete {userToDelete?.full_name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;