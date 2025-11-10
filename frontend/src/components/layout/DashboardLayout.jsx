import { Outlet, Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { toast } from 'sonner'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Define navigation items
  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['Admin', 'Department Manager', 'Employee'] },
    { name: 'Worksheets', href: '/worksheets', icon: FileText, roles: ['Admin', 'Department Manager', 'Employee'] },
    { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['Admin', 'Department Manager', 'Employee'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['Admin', 'Department Manager'] }, // Only Admin and Manager
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['Admin', 'Department Manager', 'Employee'] }
  ]

  // Filter navigation based on user role
  const navigation = allNavigation.filter(item => 
    item.roles.includes(user?.role_name)
  )

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-primary-600">
              DMHCA Worksheets
            </h1>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || `${user?.first_name} ${user?.last_name}`}
            </p>
            <p className="text-xs text-gray-500">{user?.role_name}</p>
            {user?.department_name && (
              <p className="text-xs text-gray-500">{user?.department_name}</p>
            )}
            <p className="text-xs text-green-600 mt-1 font-medium">Production Mode</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <Outlet />
      </div>
    </div>
  )
}
