import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Worksheets from './pages/Worksheets'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import { useAuthStore } from './store/authStore'

function App() {
  // BYPASS LOGIN - FOR TESTING ONLY
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/login" 
          element={<Login />} 
        />

        {/* Protected Routes - Dashboard - LOGIN BYPASSED */}
        <Route 
          path="/" 
          element={<DashboardLayout />}
        >
          <Route index element={<Dashboard />} />
          <Route path="worksheets" element={<Worksheets />} />
          <Route path="reports" element={<Reports />} />
          
          {/* Users page - LOGIN BYPASSED */}
          <Route 
            path="users" 
            element={<Users />} 
          />
          
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </>
  )
}

export default App
