import { useState } from 'react'
import { 
  Plus, 
  Download, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Eye,
  BarChart3,
  Upload,
  User,
  X,
  Save,
  Trash2,
  List,
  Grid,
  Building2,
  TrendingUp,
  Target,
  AlertCircle
} from 'lucide-react'

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedReports, setSelectedReports] = useState([])
  const [sortBy, setSortBy] = useState('date') // 'date', 'status', 'hours', 'type'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'

  // Current user info
  const [currentUser] = useState({
    name: 'Demo User',
    department: 'IT'
  })

  // New report form state
  const [newReport, setNewReport] = useState({
    title: '',
    type: 'weekly',
    department: 'IT',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    summary: '',
    accomplishments: '',
    hoursLogged: '',
    tasksCompleted: '',
    challenges: '',
    notes: ''
  })

  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Daily IT Tasks - November 7, 2025',
      type: 'daily',
      department: 'IT',
      startDate: '2025-11-07',
      endDate: '2025-11-07',
      status: 'approved',
      submittedBy: 'Demo User',
      approvedBy: 'IT Manager',
      hoursLogged: 8,
      tasksCompleted: 5,
      summary: 'Completed daily development tasks and bug fixes.',
      accomplishments: 'Fixed critical bug in authentication system, reviewed 3 pull requests, updated documentation.',
      challenges: 'Encountered some API rate limiting issues.',
      notes: 'Need to discuss API quota increase with team lead.'
    },
    {
      id: 2,
      title: 'Weekly Sales Report - Week 45',
      type: 'weekly',
      department: 'Sales',
      startDate: '2025-11-01',
      endDate: '2025-11-07',
      status: 'approved',
      submittedBy: 'Sarah Johnson',
      approvedBy: 'Sales Manager',
      hoursLogged: 40,
      tasksCompleted: 8
    },
    {
      id: 3,
      title: 'Monthly IT Summary - October 2025',
      type: 'monthly',
      department: 'IT',
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      status: 'approved',
      submittedBy: 'Jane Developer',
      approvedBy: 'IT Manager',
      hoursLogged: 168,
      tasksCompleted: 35
    },
    {
      id: 4,
      title: 'Marketing Campaign Report - Q4',
      type: 'quarterly',
      department: 'Digital Marketing',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      status: 'submitted',
      submittedBy: 'Emily Rodriguez',
      approvedBy: null,
      hoursLogged: 320,
      tasksCompleted: 67
    },
    {
      id: 5,
      title: 'Admin Weekly Tasks - Week 44',
      type: 'weekly',
      department: 'Administration',
      startDate: '2025-10-28',
      endDate: '2025-11-03',
      status: 'draft',
      submittedBy: 'David Williams',
      approvedBy: null,
      hoursLogged: 32,
      tasksCompleted: 9
    },
    {
      id: 6,
      title: 'Project Sprint Review - Nov 1-5',
      type: 'custom',
      department: 'IT',
      startDate: '2025-11-01',
      endDate: '2025-11-05',
      status: 'approved',
      submittedBy: 'Demo User',
      approvedBy: 'IT Manager',
      hoursLogged: 42,
      tasksCompleted: 15,
      summary: 'Completed sprint review for the authentication module upgrade project.',
      accomplishments: 'Successfully delivered all sprint goals including user authentication refactor, API security improvements, and comprehensive testing.',
      challenges: 'Had to work extra hours to meet the deadline due to unexpected security vulnerabilities discovered during testing.',
      notes: 'Team performed exceptionally well under pressure.'
    }
  ])

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      approved: { bg: 'bg-green-100', text: 'text-green-800' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800' }
    }
    const badge = badges[status] || badges.draft
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
        {status === 'submitted' && <Clock className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      daily: 'bg-cyan-100 text-cyan-800',
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      quarterly: 'bg-green-100 text-green-800',
      annual: 'bg-red-100 text-red-800',
      custom: 'bg-orange-100 text-orange-800'
    }
    return colors[type] || colors.weekly
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.endDate)
        bValue = new Date(b.endDate)
        break
      case 'status':
        const statusOrder = { draft: 0, submitted: 1, approved: 2, rejected: 3 }
        aValue = statusOrder[a.status]
        bValue = statusOrder[b.status]
        break
      case 'hours':
        aValue = a.hoursLogged
        bValue = b.hoursLogged
        break
      case 'type':
        aValue = a.type.toLowerCase()
        bValue = b.type.toLowerCase()
        break
      default:
        return 0
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const toggleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map(r => r.id))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedReports.length} report(s)?`)) {
      setReports(reports.filter(r => !selectedReports.includes(r.id)))
      setSelectedReports([])
    }
  }

  const handleBulkExport = (format) => {
    console.log(`Exporting ${selectedReports.length} reports as ${format}`)
    alert(`Exporting ${selectedReports.length} report(s) as ${format}`)
    setSelectedReports([])
  }

  const viewReportDetails = (report) => {
    setSelectedReport(report)
    setShowDetailsModal(true)
  }

  const handleSubmitReport = (e) => {
    e.preventDefault()
    
    const report = {
      id: reports.length + 1,
      title: newReport.title,
      type: newReport.type,
      department: newReport.department,
      startDate: newReport.startDate,
      endDate: newReport.endDate,
      status: 'submitted',
      submittedBy: currentUser.name,
      approvedBy: null,
      hoursLogged: parseInt(newReport.hoursLogged) || 0,
      tasksCompleted: parseInt(newReport.tasksCompleted) || 0,
      summary: newReport.summary,
      accomplishments: newReport.accomplishments,
      challenges: newReport.challenges,
      notes: newReport.notes
    }

    setReports([report, ...reports])
    setShowGenerateModal(false)
    setNewReport({
      title: '',
      type: 'weekly',
      department: 'IT',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      summary: '',
      accomplishments: '',
      hoursLogged: '',
      tasksCompleted: '',
      challenges: '',
      notes: ''
    })
  }

  const exportReport = (reportId, format) => {
    console.log(`Exporting report ${reportId} as ${format}`)
    alert(`Report export feature will be implemented. Format: ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Reports</h1>
          <p className="text-gray-600 mt-1">Submit your work reports and track approvals</p>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>Submit Report</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-700">My Reports</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{reports.length}</p>
          <p className="text-xs text-blue-600 mt-1">Submitted reports</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-700">Approved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {reports.filter(r => r.status === 'approved').length}
          </p>
          <p className="text-xs text-green-600 mt-1">Accepted by manager</p>
        </div>
        <div className="card bg-yellow-50">
          <p className="text-sm text-yellow-700">Under Review</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {reports.filter(r => r.status === 'submitted').length}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
        </div>
        <div className="card bg-purple-50">
          <p className="text-sm text-purple-700">Total Hours</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {reports.reduce((sum, r) => sum + r.hoursLogged, 0)}h
          </p>
          <p className="text-xs text-purple-600 mt-1">Hours reported</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, department, or submitter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom Range</option>
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
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedReports.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
            <span className="text-sm font-medium text-blue-900">
              {selectedReports.length} report(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkExport('xlsx')}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export XLSX
              </button>
              <button
                onClick={() => handleBulkExport('pdf')}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export PDF
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
              <option value="date">Date</option>
              <option value="status">Status</option>
              <option value="hours">Hours</option>
              <option value="type">Type</option>
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
              onClick={() => setViewMode('grid')}
              className={`p-2 border rounded-md ${viewMode === 'grid' ? 'bg-primary-100 border-primary-500' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 border rounded-md ${viewMode === 'list' ? 'bg-primary-100 border-primary-500' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="card hover:shadow-lg transition-shadow relative">
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedReports.includes(report.id)}
                  onChange={() => toggleSelectReport(report.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div className="pr-8">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                    {report.type.toUpperCase()}
                  </span>
                  {getStatusBadge(report.status)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.department}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {report.hoursLogged} hours logged
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    {report.tasksCompleted} tasks completed
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-3">
                  Submitted by <span className="font-medium">{report.submittedBy}</span>
                  {report.approvedBy && (
                    <> • Approved by <span className="font-medium">{report.approvedBy}</span></>
                  )}
                </p>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => viewReportDetails(report)}
                    className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => exportReport(report.id, 'pdf')}
                    className="btn-primary text-sm py-2 px-3 flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="col-span-full card text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reports found</p>
              <button 
                onClick={() => setShowGenerateModal(true)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Submit your first report
              </button>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks
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
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleSelectReport(report.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                            {report.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-xs text-gray-500">{report.department}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          By: {report.submittedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div>{new Date(report.startDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">to {new Date(report.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {report.hoursLogged}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        {report.tasksCompleted}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => viewReportDetails(report)}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => exportReport(report.id, 'pdf')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this report?')) {
                              setReports(reports.filter(r => r.id !== report.id))
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No reports found</p>
              <button 
                onClick={() => setShowGenerateModal(true)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Submit your first report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Submit Work Report</h2>
              </div>
              <button
                onClick={() => {
                  setShowGenerateModal(false)
                  setNewReport({
                    title: '',
                    type: 'weekly',
                    department: 'IT',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0],
                    summary: '',
                    accomplishments: '',
                    hoursLogged: '',
                    tasksCompleted: '',
                    challenges: '',
                    notes: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Submitting as:</strong> {currentUser.name} ({currentUser.department})
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Submit your completed work report for review and approval
                </p>
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary-600" />
                  Report Details
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    placeholder="e.g., Weekly Sales Report - Week 45"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newReport.type}
                      onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newReport.startDate}
                      onChange={(e) => setNewReport({...newReport, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newReport.endDate}
                      onChange={(e) => setNewReport({...newReport, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newReport.department}
                      onChange={(e) => setNewReport({...newReport, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="IT">IT</option>
                      <option value="Sales">Sales</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours Logged <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newReport.hoursLogged}
                        onChange={(e) => setNewReport({...newReport, hoursLogged: e.target.value})}
                        placeholder="40"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tasks Completed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newReport.tasksCompleted}
                        onChange={(e) => setNewReport({...newReport, tasksCompleted: e.target.value})}
                        placeholder="8"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Summary */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  Work Summary
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newReport.summary}
                    onChange={(e) => setNewReport({...newReport, summary: e.target.value})}
                    placeholder="Provide a brief overview of your work during this period..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Accomplishments <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newReport.accomplishments}
                    onChange={(e) => setNewReport({...newReport, accomplishments: e.target.value})}
                    placeholder="List your main achievements, completed projects, or milestones..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges & Blockers
                  </label>
                  <textarea
                    rows={3}
                    value={newReport.challenges}
                    onChange={(e) => setNewReport({...newReport, challenges: e.target.value})}
                    placeholder="Describe any challenges, blockers, or issues encountered..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newReport.notes}
                    onChange={(e) => setNewReport({...newReport, notes: e.target.value})}
                    placeholder="Any additional comments or information..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end space-x-3 border-t pt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setShowGenerateModal(false)
                    setNewReport({
                      title: '',
                      type: 'weekly',
                      department: 'IT',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date().toISOString().split('T')[0],
                      summary: '',
                      accomplishments: '',
                      hoursLogged: '',
                      tasksCompleted: '',
                      challenges: '',
                      notes: ''
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
                  <Upload className="w-5 h-5" />
                  <span>Submit Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedReport(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(selectedReport.type)}`}>
                    {selectedReport.type.toUpperCase()}
                  </span>
                  {getStatusBadge(selectedReport.status)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.title}</h3>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  {selectedReport.department}
                </div>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Report Period</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Submitted By</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{selectedReport.submittedBy}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-700">Hours Logged</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{selectedReport.hoursLogged}h</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-700">Tasks Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{selectedReport.tasksCompleted}</p>
                </div>
              </div>

              {/* Work Summary */}
              {selectedReport.summary && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.summary}</p>
                </div>
              )}

              {/* Accomplishments */}
              {selectedReport.accomplishments && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Accomplishments</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.accomplishments}</p>
                </div>
              )}

              {/* Challenges */}
              {selectedReport.challenges && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                    Challenges & Blockers
                  </h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.challenges}</p>
                </div>
              )}

              {/* Notes */}
              {selectedReport.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Notes</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReport.notes}</p>
                </div>
              )}

              {/* Approval Info */}
              {selectedReport.approvedBy && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Approved by <span className="font-semibold text-gray-900">{selectedReport.approvedBy}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedReport(null)
                }}
                className="btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => exportReport(selectedReport.id, 'pdf')}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
