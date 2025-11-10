import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Building2,
  X,
  Save,
  Lock,
  User,
  FileText,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [selectedUsers, setSelectedUsers] = useState([])
  const [sortBy, setSortBy] = useState('name') // 'name', 'role', 'department', 'lastActive'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    department: 'IT',
    status: 'active'
  })

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@dmhca.com',
      phone: '+1 234-567-8901',
      role: 'Department Manager',
      department: 'Sales',
      status: 'active',
      avatar: 'SJ',
      worksheetCount: 142,
      reportCount: 12,
      lastActive: '2025-11-07'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@dmhca.com',
      phone: '+1 234-567-8902',
      role: 'Employee',
      department: 'IT',
      status: 'active',
      avatar: 'MC',
      worksheetCount: 89,
      reportCount: 8,
      lastActive: '2025-11-06'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@dmhca.com',
      phone: '+1 234-567-8903',
      role: 'Team Lead',
      department: 'Digital Marketing',
      status: 'active',
      avatar: 'ER',
      worksheetCount: 156,
      reportCount: 15,
      lastActive: '2025-11-07'
    },
    {
      id: 4,
      name: 'David Williams',
      email: 'david.williams@dmhca.com',
      phone: '+1 234-567-8904',
      role: 'Employee',
      department: 'Administration',
      status: 'inactive',
      avatar: 'DW',
      worksheetCount: 67,
      reportCount: 5,
      lastActive: '2025-10-28'
    },
    {
      id: 5,
      name: 'Jessica Brown',
      email: 'jessica.brown@dmhca.com',
      phone: '+1 234-567-8905',
      role: 'Admin',
      department: 'Administration',
      status: 'active',
      avatar: 'JB',
      worksheetCount: 234,
      reportCount: 28,
      lastActive: '2025-11-07'
    },
    {
      id: 6,
      name: 'James Taylor',
      email: 'james.taylor@dmhca.com',
      phone: '+1 234-567-8906',
      role: 'Auditor',
      department: 'Administration',
      status: 'active',
      avatar: 'JT',
      worksheetCount: 45,
      reportCount: 34,
      lastActive: '2025-11-05'
    }
  ])

  const getRoleBadge = (role) => {
    const badges = {
      'Admin': { bg: 'bg-red-100', text: 'text-red-800' },
      'Department Manager': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Team Lead': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Employee': { bg: 'bg-green-100', text: 'text-green-800' },
      'Auditor': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    }
    const badge = badges[role] || badges['Employee']
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Shield className="w-3 h-3 mr-1" />
        {role}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  }).sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'role':
        aValue = a.role.toLowerCase()
        bValue = b.role.toLowerCase()
        break
      case 'department':
        aValue = a.department.toLowerCase()
        bValue = b.department.toLowerCase()
        break
      case 'lastActive':
        aValue = new Date(a.lastActive)
        bValue = new Date(b.lastActive)
        break
      default:
        return 0
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
  }

  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      setUsers(users.filter(u => !selectedUsers.includes(u.id)))
      setSelectedUsers([])
    }
  }

  const handleBulkStatusChange = (newStatus) => {
    setUsers(users.map(u => 
      selectedUsers.includes(u.id)
        ? { ...u, status: newStatus }
        : u
    ))
    setSelectedUsers([])
  }

  const viewUserDetails = (user) => {
    setSelectedUser(user)
    setShowDetailsModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      confirmPassword: '',
      role: user.role,
      department: user.department,
      status: user.status
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    
    if (newUser.password && newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setUsers(users.map(u => 
      u.id === editingUser.id
        ? {
            ...u,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            department: newUser.department,
            status: newUser.status,
            avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
          }
        : u
    ))

    setShowEditModal(false)
    setEditingUser(null)
    setNewUser({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'Employee',
      department: 'IT',
      status: 'active'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-700">Total Users</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{users.length}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-700">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="card bg-purple-50">
          <p className="text-sm text-purple-700">Managers</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {users.filter(u => u.role === 'Department Manager').length}
          </p>
        </div>
        <div className="card bg-yellow-50">
          <p className="text-sm text-yellow-700">Employees</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {users.filter(u => u.role === 'Employee').length}
          </p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Department Manager">Department Manager</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Employee">Employee</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusChange('active')}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusChange('inactive')}
                className="text-sm px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Sort & View Options */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name">Name</option>
              <option value="role">Role</option>
              <option value="department">Department</option>
              <option value="lastActive">Last Active</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 border rounded-md ${viewMode === 'table' ? 'bg-primary-100 border-primary-500' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border rounded-md ${viewMode === 'grid' ? 'bg-primary-100 border-primary-500' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users View */}
      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{user.avatar}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.worksheetCount} worksheets</div>
                        <div className="text-gray-500">{user.reportCount} reports</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Last: {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card hover:shadow-lg transition-shadow relative">
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleSelectUser(user.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="pr-8">
                {/* Avatar and Name */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{user.avatar}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <div className="mt-1">
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Email */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {user.phone}
                  </div>

                  {/* Department */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {user.department}
                  </div>

                  {/* Activity Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">{user.worksheetCount}</span>
                      <span className="text-gray-500 ml-1">worksheets</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">{user.reportCount}</span>
                      <span className="text-gray-500 ml-1">reports</span>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Last active: {new Date(user.lastActive).toLocaleDateString()}
                  </div>

                  {/* Status */}
                  <div className="pt-2">
                    {getStatusBadge(user.status)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => viewUserDetails(user)}
                  className="text-primary-600 hover:text-primary-900 p-2 rounded hover:bg-primary-50" 
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openEditModal(user)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50" 
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleUserStatus(user.id)}
                  className={`p-2 rounded ${user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'}`}
                  title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false)
                  setNewUser({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    role: 'Employee',
                    department: 'IT',
                    status: 'active'
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              
              // Validation
              if (newUser.password !== newUser.confirmPassword) {
                alert('Passwords do not match!')
                return
              }

              if (newUser.password.length < 8) {
                alert('Password must be at least 8 characters long!')
                return
              }

              // Check if email already exists
              if (users.some(u => u.email === newUser.email)) {
                alert('Email already exists!')
                return
              }

              // Generate avatar initials
              const nameParts = newUser.name.trim().split(' ')
              const avatar = nameParts.length > 1 
                ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                : nameParts[0].substring(0, 2).toUpperCase()

              // Create new user
              const createdUser = {
                id: users.length + 1,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                department: newUser.department,
                status: newUser.status,
                avatar: avatar,
                worksheetCount: 0,
                reportCount: 0,
                lastActive: new Date().toISOString().split('T')[0]
              }

              setUsers([...users, createdUser])
              setShowCreateModal(false)
              setNewUser({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                role: 'Employee',
                department: 'IT',
                status: 'active'
              })

              alert('User created successfully!')
            }} className="p-6 space-y-6">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Personal Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="john.doe@dmhca.com"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="+1 234-567-8900"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary-600" />
                  Security
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Min 8 characters"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    {newUser.password && newUser.confirmPassword && newUser.password !== newUser.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary-600" />
                  Role & Department
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Department Manager">Department Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Auditor">Auditor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        required
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="Sales">Sales</option>
                        <option value="IT">IT</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newUser.status}
                      onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Role Description */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Role Permissions:</strong>
                    {newUser.role === 'Admin' && ' Full system access, user management, and configuration.'}
                    {newUser.role === 'Department Manager' && ' Manage department users, approve worksheets and reports.'}
                    {newUser.role === 'Team Lead' && ' Review team worksheets, create reports, and monitor progress.'}
                    {newUser.role === 'Employee' && ' Create and submit worksheets, view personal reports.'}
                    {newUser.role === 'Auditor' && ' Read-only access to all worksheets and reports for compliance.'}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-3 border-t pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewUser({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      confirmPassword: '',
                      role: 'Employee',
                      department: 'IT',
                      status: 'active'
                    })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Header */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{selectedUser.avatar}</span>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Email</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Phone className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Phone</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{selectedUser.phone}</p>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Work Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Role</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{selectedUser.role}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Building2 className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Department</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">{selectedUser.department}</p>
                  </div>
                </div>
              </div>

              {/* Activity Statistics */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Activity Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Total Worksheets</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedUser.worksheetCount}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Total Reports</p>
                    <p className="text-2xl font-bold text-green-900">{selectedUser.reportCount}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Calendar className="w-4 h-4 text-purple-700 mr-1" />
                      <p className="text-sm text-purple-700">Last Active</p>
                    </div>
                    <p className="text-base font-bold text-purple-900">
                      {new Date(selectedUser.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedUser(null)
                }}
                className="btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowDetailsModal(false)
                  openEditModal(selectedUser)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              <button 
                onClick={() => {
                  toggleUserStatus(selectedUser.id)
                  setSelectedUser({...selectedUser, status: selectedUser.status === 'active' ? 'inactive' : 'active'})
                }}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  selectedUser.status === 'active' 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedUser.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                <span>{selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setNewUser({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    role: 'Employee',
                    department: 'IT',
                    status: 'active'
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Personal Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="john.doe@dmhca.com"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="+1 234-567-8900"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary-600" />
                  Role & Access
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Department Manager">Department Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Auditor">Auditor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="IT">IT</option>
                      <option value="Sales">Sales</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newUser.status}
                      onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password (Optional) */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary-600" />
                  Change Password (Optional)
                </h4>
                <p className="text-sm text-gray-600">Leave blank to keep current password</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      minLength={8}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-3 border-t pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setNewUser({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      confirmPassword: '',
                      role: 'Employee',
                      department: 'IT',
                      status: 'active'
                    })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Update User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
