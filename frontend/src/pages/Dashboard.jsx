import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, Clock, BarChart3, Loader2, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { dashboardAPI, worksheetAPI, reportAPI } from '../services/api';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [recentWorksheets, setRecentWorksheets] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const statsResponse = await dashboardAPI.getStats();
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
      const worksheetsResponse = await worksheetAPI.getAll();
      if (worksheetsResponse.data.success) {
        setRecentWorksheets(worksheetsResponse.data.data.slice(0, 5));
      }
      const reportsResponse = await reportAPI.getAll();
      if (reportsResponse.data.success) {
        setRecentReports(reportsResponse.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name || user?.first_name}!</p>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{stats.worksheets?.total || 0}</p>
            <p className="text-sm text-gray-600">Total Worksheets</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold">{stats.worksheets?.pending || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{stats.reports?.total || 0}</p>
            <p className="text-sm text-gray-600">Reports</p>
          </div>
          {['Admin', 'Department Manager'].includes(user?.role_name) && (
            <div className="bg-white rounded-lg shadow p-6">
              <Users className="w-8 h-8 text-indigo-600 mb-2" />
              <p className="text-2xl font-bold">{stats.users?.total || 0}</p>
              <p className="text-sm text-gray-600">Users</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Worksheets</h2>
          <Link to="/worksheets" className="text-blue-600">View All </Link>
        </div>
        {recentWorksheets.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No worksheets found</p>
        ) : (
          <div className="space-y-3">
            {recentWorksheets.map((w) => (
              <div key={w.id} className="border p-3 rounded">
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-sm text-gray-600">{w.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Reports</h2>
          <Link to="/reports" className="text-blue-600">View All </Link>
        </div>
        {recentReports.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reports found</p>
        ) : (
          <div className="space-y-3">
            {recentReports.map((r) => (
              <div key={r.id} className="border p-3 rounded">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
