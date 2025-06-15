'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SafeguardingAlert {
  id: string;
  userId: string;
  userName: string;
  content: string;
  context: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'REVIEWED' | 'ESCALATED' | 'RESOLVED';
  createdAt: string;
  flags: {
    selfHarm?: boolean;
    violence?: boolean;
    abuse?: boolean;
    bullying?: boolean;
    other?: string;
  };
}

interface SafeguardingReport {
  id: string;
  reporterName: string;
  concernType: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
  createdAt: string;
}

export default function SafeguardingDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [alerts, setAlerts] = useState<SafeguardingAlert[]>([]);
  const [reports, setReports] = useState<SafeguardingReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'critical'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<SafeguardingAlert | null>(null);

  useEffect(() => {
    // Check if user is DSL
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      if (userRole !== 'DSL' && userRole !== 'ADMIN') {
        router.push('/unauthorized' as any);
        return;
      }
      fetchSafeguardingData();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin' as any);
    }
  }, [session, status]);

  const fetchSafeguardingData = async () => {
    try {
      const [alertsRes, reportsRes] = await Promise.all([
        fetch('/api/safeguarding/alerts'),
        fetch('/api/safeguarding/reports'),
      ]);

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch safeguarding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlertStatus = async (alertId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/safeguarding/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchSafeguardingData();
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      case 'ESCALATED':
        return 'bg-red-100 text-red-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'critical') return alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
    if (filter === 'pending') return alert.status === 'PENDING';
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading safeguarding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Safeguarding Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage safeguarding concerns across the platform
          </p>
        </div>

        {/* Critical Alerts Banner */}
        {alerts.some(a => a.severity === 'CRITICAL' && a.status === 'PENDING') && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4" role="alert" aria-live="assertive">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Critical alerts require immediate attention
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'PENDING').length} critical alert(s) pending review
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending ({alerts.filter(a => a.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'critical'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Critical/High ({alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length})
            </button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automated Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Automated Content Alerts
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No alerts to display</p>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getSeverityColor(alert.severity)}`}
                    onClick={() => setSelectedAlert(alert)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && setSelectedAlert(alert)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{alert.userName}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      Context: {alert.context}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(alert.flags).map(([flag, value]) => 
                        value && (
                          <span key={flag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {flag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manual Reports */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Manual Reports
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {reports.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reports to display</p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(report.urgency)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{report.concernType}</p>
                        <p className="text-xs text-gray-600">
                          Reported by: {report.reporterName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {report.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto" role="dialog" aria-modal="true">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alert Details
                  </h3>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="Close dialog"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-medium">{selectedAlert.userName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Context</p>
                    <p className="font-medium">{selectedAlert.context}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Flagged Content</p>
                    <div className="mt-2 p-3 bg-gray-100 rounded">
                      <p className="text-sm">{selectedAlert.content}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Actions</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateAlertStatus(selectedAlert.id, 'REVIEWED')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Mark as Reviewed
                      </button>
                      <button
                        onClick={() => updateAlertStatus(selectedAlert.id, 'ESCALATED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Escalate
                      </button>
                      <button
                        onClick={() => updateAlertStatus(selectedAlert.id, 'RESOLVED')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}