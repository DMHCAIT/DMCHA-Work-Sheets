import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Save,
  AlertCircle,
  Building
} from 'lucide-react'

export default function Worksheets() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedWorksheet, setSelectedWorksheet] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedWorksheets, setSelectedWorksheets] = useState([])
  const [sortBy, setSortBy] = useState('date') // 'date', 'priority', 'progress', 'status'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  
  // Available team members for assignment
  const [teamMembers] = useState([
    { id: 1, name: 'John Smith', avatar: 'JS', department: 'Sales' },
    { id: 2, name: 'Jane Developer', avatar: 'JD', department: 'IT' },
    { id: 3, name: 'Sarah Johnson', avatar: 'SJ', department: 'Sales' },
    { id: 4, name: 'Emily Rodriguez', avatar: 'ER', department: 'Digital Marketing' },
    { id: 5, name: 'David Williams', avatar: 'DW', department: 'Administration' },
    { id: 6, name: 'Michael Chen', avatar: 'MC', department: 'IT' }
  ])
  
  // Form state for creating worksheet
  const [newWorksheet, setNewWorksheet] = useState({
    title: '',
    description: '',
    department: 'IT',
    priority: 'medium',
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
    taskType: 'development',
    blockers: '',
    achievements: '',
    attachments: [],
    assignedTo: '',
    assignedBy: 'Demo User',
    progress: 0,
    estimatedHours: '',
    tags: []
  })

  const [worksheets, setWorksheets] = useState([
    {
      id: 1,
      title: 'Daily Sales Report - Nov 7',
      user: 'John Smith',
      assignedTo: 'John Smith',
      assignedBy: 'Sarah Johnson',
      department: 'Sales',
      progress: 100,
      date: '2025-11-07',
      status: 'submitted',
      effortHours: 8.0,
      priority: 'high'
    },
    {
      id: 2,
      title: 'IT Sprint Tasks - Week 45',
      user: 'Jane Developer',
      assignedTo: 'Jane Developer',
      assignedBy: 'IT Manager',
      department: 'IT',
      progress: 85,
      date: '2025-11-07',
      status: 'approved',
      effortHours: 7.5,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Marketing Campaign Analytics',
      user: 'Emily Rodriguez',
      assignedTo: 'Emily Rodriguez',
      assignedBy: 'Marketing Lead',
      department: 'Digital Marketing',
      progress: 30,
      date: '2025-11-06',
      status: 'draft',
      effortHours: 6.0,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Admin Daily Tasks',
      user: 'David Williams',
      assignedTo: 'David Williams',
      assignedBy: 'Admin Manager',
      department: 'Administration',
      progress: 50,
      date: '2025-11-06',
      status: 'rejected',
      effortHours: 8.0,
      priority: 'low'
    },
    {
      id: 5,
      title: 'Sales Follow-ups',
      user: 'Sarah Johnson',
      assignedTo: 'Sarah Johnson',
      assignedBy: 'Sales Director',
      department: 'Sales',
      progress: 100,
      date: '2025-11-05',
      status: 'approved',
      effortHours: 7.0,
      priority: 'high'
    }
  ])

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    }
    const badge = badges[status] || badges.draft
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-purple-100 text-purple-800'
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    )
  }

  const filteredWorksheets = worksheets.filter(worksheet => {
    const matchesSearch = worksheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worksheet.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (worksheet.assignedTo && worksheet.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || worksheet.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || worksheet.department === filterDepartment
    const matchesPriority = filterPriority === 'all' || worksheet.priority === filterPriority
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
  }).sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date)
        break
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'progress':
        comparison = (a.progress || 0) - (b.progress || 0)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      default:
        comparison = 0
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleBulkDelete = () => {
    if (selectedWorksheets.length === 0) return
    if (confirm(`Are you sure you want to delete ${selectedWorksheets.length} worksheet(s)?`)) {
      setWorksheets(worksheets.filter(w => !selectedWorksheets.includes(w.id)))
      setSelectedWorksheets([])
    }
  }

  const handleBulkStatusChange = (newStatus) => {
    if (selectedWorksheets.length === 0) return
    setWorksheets(worksheets.map(w => 
      selectedWorksheets.includes(w.id) ? { ...w, status: newStatus } : w
    ))
    setSelectedWorksheets([])
  }

  const toggleSelectWorksheet = (id) => {
    setSelectedWorksheets(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedWorksheets.length === filteredWorksheets.length) {
      setSelectedWorksheets([])
    } else {
      setSelectedWorksheets(filteredWorksheets.map(w => w.id))
    }
  }

  const viewWorksheetDetails = (worksheet) => {
    setSelectedWorksheet(worksheet)
    setShowDetailsModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Assignment</h1>
          <p className="text-gray-600 mt-1">Assign tasks and track work for your team members</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCalendarView(!showCalendarView)}
            className={`btn-secondary flex items-center space-x-2 ${showCalendarView ? 'bg-primary-100 text-primary-700' : ''}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Calendar View</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Assign New Work</span>
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, user, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
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
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions & View Toggle */}
        {selectedWorksheets.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm font-medium text-blue-900">
              {selectedWorksheets.length} worksheet(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusChange('approved')}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkStatusChange('rejected')}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
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
              <option value="date">Date</option>
              <option value="priority">Priority</option>
              <option value="progress">Progress</option>
              <option value="status">Status</option>
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
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-700">Total Assigned</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{worksheets.length}</p>
          <p className="text-xs text-blue-600 mt-1">Work assignments</p>
        </div>
        <div className="card bg-orange-50">
          <p className="text-sm text-orange-700">In Progress</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {worksheets.filter(w => w.status === 'submitted').length}
          </p>
          <p className="text-xs text-orange-600 mt-1">Active tasks</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-700">Completed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {worksheets.filter(w => w.status === 'approved').length}
          </p>
          <p className="text-xs text-green-600 mt-1">Approved work</p>
        </div>
        <div className="card bg-purple-50">
          <p className="text-sm text-purple-700">Total Hours</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {worksheets.reduce((sum, w) => sum + w.effortHours, 0).toFixed(1)}h
          </p>
          <p className="text-xs text-purple-600 mt-1">Work hours assigned</p>
        </div>
      </div>

      {/* Worksheets View */}
      {viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedWorksheets.length === filteredWorksheets.length && filteredWorksheets.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worksheet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
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
                {filteredWorksheets.map((worksheet) => (
                  <tr key={worksheet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedWorksheets.includes(worksheet.id)}
                        onChange={() => toggleSelectWorksheet(worksheet.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{worksheet.title}</div>
                        <div className="text-xs text-gray-500">{worksheet.department}</div>
                        {worksheet.assignedBy && (
                          <div className="text-xs text-gray-400 mt-1">
                            Assigned by: {worksheet.assignedBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="ml-2 text-sm text-gray-900">
                          {worksheet.assignedTo || worksheet.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{worksheet.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              (worksheet.progress || 0) === 100 ? 'bg-green-500' :
                              (worksheet.progress || 0) >= 75 ? 'bg-blue-500' :
                              (worksheet.progress || 0) >= 50 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${worksheet.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(worksheet.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {worksheet.effortHours}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(worksheet.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(worksheet.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => viewWorksheetDetails(worksheet)}
                          className="text-primary-600 hover:text-primary-900" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWorksheets.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No work assignments found</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Assign your first task
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorksheets.map((worksheet) => (
            <div key={worksheet.id} className="card hover:shadow-lg transition-shadow relative">
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedWorksheets.includes(worksheet.id)}
                  onChange={() => toggleSelectWorksheet(worksheet.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              
              <div className="pr-8">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{worksheet.title}</h3>
                    <p className="text-sm text-gray-500">{worksheet.department}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Assigned To */}
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{worksheet.assignedTo || worksheet.user}</span>
                  </div>

                  {/* Date & Hours */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(worksheet.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {worksheet.effortHours}h
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-gray-700">{worksheet.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          (worksheet.progress || 0) === 100 ? 'bg-green-500' :
                          (worksheet.progress || 0) >= 75 ? 'bg-blue-500' :
                          (worksheet.progress || 0) >= 50 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${worksheet.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Priority & Status */}
                  <div className="flex items-center justify-between">
                    {getPriorityBadge(worksheet.priority)}
                    {getStatusBadge(worksheet.status)}
                  </div>

                  {/* Assigned By */}
                  {worksheet.assignedBy && (
                    <p className="text-xs text-gray-400 italic">
                      Assigned by: {worksheet.assignedBy}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => viewWorksheetDetails(worksheet)}
                  className="text-primary-600 hover:text-primary-900 p-2 rounded hover:bg-primary-50" 
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredWorksheets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No work assignments found</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Assign your first task
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {showCalendarView && (
        <div className="card">
          <YearlyCalendar worksheets={worksheets} onDateClick={(date) => {
            setNewWorksheet({...newWorksheet, date: date})
            setShowCreateModal(true)
          }} />
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Assign New Work</h3>
                <p className="text-sm text-gray-600 mt-1">Create and assign a task to a team member</p>
              </div>
              <button 
                onClick={() => {
                  setShowCreateModal(false)
                  setNewWorksheet({
                    title: '',
                    description: '',
                    department: 'IT',
                    priority: 'medium',
                    startTime: '',
                    endTime: '',
                    date: new Date().toISOString().split('T')[0],
                    taskType: 'development',
                    blockers: '',
                    achievements: '',
                    attachments: []
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const newEntry = {
                id: worksheets.length + 1,
                title: newWorksheet.title,
                description: newWorksheet.description,
                user: 'Demo User',
                avatar: 'DU',
                department: newWorksheet.department,
                date: newWorksheet.date,
                startTime: newWorksheet.startTime,
                endTime: newWorksheet.endTime,
                hours: calculateHours(newWorksheet.startTime, newWorksheet.endTime),
                effortHours: parseFloat(calculateHours(newWorksheet.startTime, newWorksheet.endTime)) || 0,
                priority: newWorksheet.priority,
                status: 'draft',
                taskType: newWorksheet.taskType,
                blockers: newWorksheet.blockers,
                achievements: newWorksheet.achievements,
                assignedTo: newWorksheet.assignedTo,
                assignedBy: newWorksheet.assignedBy,
                progress: parseInt(newWorksheet.progress) || 0
              }
              setWorksheets([newEntry, ...worksheets])
              setShowCreateModal(false)
              setNewWorksheet({
                title: '',
                description: '',
                department: 'IT',
                priority: 'medium',
                startTime: '',
                endTime: '',
                date: new Date().toISOString().split('T')[0],
                taskType: 'development',
                blockers: '',
                achievements: '',
                attachments: [],
                assignedTo: '',
                assignedBy: 'Demo User',
                progress: 0,
                estimatedHours: '',
                tags: []
              })
            }} className="p-6 space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Worksheet Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorksheet.title}
                      onChange={(e) => setNewWorksheet({...newWorksheet, title: e.target.value})}
                      placeholder="e.g., User Authentication Module Development"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign To <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newWorksheet.assignedTo}
                      onChange={(e) => setNewWorksheet({...newWorksheet, assignedTo: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>
                          {member.name} - {member.department}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose who will work on this task</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newWorksheet.date}
                      onChange={(e) => setNewWorksheet({...newWorksheet, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newWorksheet.department}
                      onChange={(e) => setNewWorksheet({...newWorksheet, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Sales">Sales</option>
                      <option value="IT">IT</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newWorksheet.taskType}
                      onChange={(e) => setNewWorksheet({...newWorksheet, taskType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="development">Development</option>
                      <option value="bug-fix">Bug Fix</option>
                      <option value="testing">Testing</option>
                      <option value="documentation">Documentation</option>
                      <option value="meeting">Meeting</option>
                      <option value="research">Research</option>
                      <option value="deployment">Deployment</option>
                      <option value="support">Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newWorksheet.priority}
                      onChange={(e) => setNewWorksheet({...newWorksheet, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Progress (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newWorksheet.progress}
                      onChange={(e) => setNewWorksheet({...newWorksheet, progress: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set initial completion status (0-100)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={newWorksheet.estimatedHours}
                      onChange={(e) => setNewWorksheet({...newWorksheet, estimatedHours: e.target.value})}
                      placeholder="e.g., 8"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Expected time to complete</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={newWorksheet.description}
                      onChange={(e) => setNewWorksheet({...newWorksheet, description: e.target.value})}
                      placeholder="Provide detailed description of the work performed..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Assignment Info */}
                  {newWorksheet.assignedTo && (
                    <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Task Assignment
                          </p>
                          <p className="text-sm text-blue-800 mt-1">
                            This worksheet will be assigned to <strong>{newWorksheet.assignedTo}</strong>
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Assigned by: {newWorksheet.assignedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Tracking */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Time Tracking
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={newWorksheet.startTime}
                      onChange={(e) => setNewWorksheet({...newWorksheet, startTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={newWorksheet.endTime}
                      onChange={(e) => setNewWorksheet({...newWorksheet, endTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Hours
                    </label>
                    <input
                      type="text"
                      disabled
                      value={calculateHours(newWorksheet.startTime, newWorksheet.endTime)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary-600" />
                  Additional Details
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Achievements
                  </label>
                  <textarea
                    rows="3"
                    value={newWorksheet.achievements}
                    onChange={(e) => setNewWorksheet({...newWorksheet, achievements: e.target.value})}
                    placeholder="List major accomplishments, completed tasks, or milestones achieved..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blockers / Issues
                  </label>
                  <textarea
                    rows="3"
                    value={newWorksheet.blockers}
                    onChange={(e) => setNewWorksheet({...newWorksheet, blockers: e.target.value})}
                    placeholder="Describe any blockers, challenges, or issues encountered..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-3 border-t pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewWorksheet({
                      title: '',
                      description: '',
                      department: 'IT',
                      priority: 'medium',
                      startTime: '',
                      endTime: '',
                      date: new Date().toISOString().split('T')[0],
                      taskType: 'development',
                      blockers: '',
                      achievements: '',
                      attachments: []
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
                  <span>Save as Draft</span>
                </button>
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Worksheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Worksheet Details Modal */}
      {showDetailsModal && selectedWorksheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Worksheet Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedWorksheet(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedWorksheet.title}</h3>
                <div className="flex items-center space-x-3">
                  {getPriorityBadge(selectedWorksheet.priority)}
                  {getStatusBadge(selectedWorksheet.status)}
                </div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Assigned To</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedWorksheet.assignedTo || selectedWorksheet.user}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Building className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Department</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedWorksheet.department}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Date</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(selectedWorksheet.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Effort Hours</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedWorksheet.effortHours}h</p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-900">Progress</span>
                  <span className="text-lg font-bold text-blue-900">{selectedWorksheet.progress || 0}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      (selectedWorksheet.progress || 0) === 100 ? 'bg-green-600' :
                      (selectedWorksheet.progress || 0) >= 75 ? 'bg-blue-600' :
                      (selectedWorksheet.progress || 0) >= 50 ? 'bg-yellow-600' :
                      'bg-orange-600'
                    }`}
                    style={{ width: `${selectedWorksheet.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Details */}
              {selectedWorksheet.taskType && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Task Type</h4>
                  <p className="text-gray-900 capitalize">{selectedWorksheet.taskType}</p>
                </div>
              )}

              {selectedWorksheet.achievements && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedWorksheet.achievements}</p>
                </div>
              )}

              {selectedWorksheet.blockers && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Blockers</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedWorksheet.blockers}</p>
                </div>
              )}

              {/* Assignment Info */}
              {selectedWorksheet.assignedBy && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Assigned by <span className="font-semibold text-gray-900">{selectedWorksheet.assignedBy}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedWorksheet(null)
                }}
                className="btn-secondary"
              >
                Close
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate hours
function calculateHours(startTime, endTime) {
  if (!startTime || !endTime) return '0.0 hrs'
  
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  
  const diffMinutes = endMinutes - startMinutes
  const hours = (diffMinutes / 60).toFixed(1)
  
  return `${hours} hrs`
}

// Yearly Calendar Component
function YearlyCalendar({ worksheets, onDateClick }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getWorksheetsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return worksheets.filter(w => w.date === dateStr)
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(currentYear, monthIndex)
    const firstDay = getFirstDayOfMonth(currentYear, monthIndex)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const worksheetsOnDay = getWorksheetsForDate(currentYear, monthIndex, day)
      const hasWorksheets = worksheetsOnDay.length > 0
      const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isToday = dateStr === new Date().toISOString().split('T')[0]

      days.push(
        <button
          key={day}
          onClick={() => onDateClick(dateStr)}
          className={`h-8 rounded text-sm flex items-center justify-center relative hover:bg-primary-100 transition-colors ${
            isToday ? 'bg-primary-600 text-white font-bold hover:bg-primary-700' : ''
          } ${hasWorksheets && !isToday ? 'bg-green-100 text-green-800 font-medium' : ''}`}
          title={hasWorksheets ? `${worksheetsOnDay.length} worksheet(s)` : 'Click to create worksheet'}
        >
          {day}
          {hasWorksheets && !isToday && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-600 rounded-full"></span>
          )}
        </button>
      )
    }

    return (
      <div key={monthIndex} className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 text-center">{months[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentYear(currentYear - 1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">{currentYear}</h2>
        <button
          onClick={() => setCurrentYear(currentYear + 1)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((_, index) => renderMonth(index))}
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary-600 rounded"></div>
          <span className="text-gray-600">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-600 rounded"></div>
          <span className="text-gray-600">Has Worksheets</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-600">No Worksheets</span>
        </div>
      </div>
    </div>
  )
}
