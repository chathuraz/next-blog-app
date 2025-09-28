'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const page = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    unsubscribed: 0
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)

  // Fetch subscriptions
  const fetchSubscriptions = async (page = 1, status = '', search = '') => {
    try {
      setLoading(true)
      let url = `/api/subscription?page=${page}&limit=20`
      
      if (status) {
        url += `&status=${status}`
      }
      
      const response = await axios.get(url)
      
      if (response.data.success) {
        let filteredData = response.data.data
        
        // Client-side search filtering (since API doesn't support search yet)
        if (search) {
          filteredData = response.data.data.filter(sub =>
            sub.email.toLowerCase().includes(search.toLowerCase())
          )
        }
        
        setSubscriptions(filteredData)
        setPagination(response.data.pagination)
        setStats(response.data.stats)
      } else {
        toast.error('Failed to fetch subscriptions')
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Error fetching subscriptions')
    } finally {
      setLoading(false)
    }
  }

  // Update subscription status
  const updateSubscriptionStatus = async (id, newStatus) => {
    if (!confirm(`Are you sure you want to mark this subscription as ${newStatus}?`)) {
      return
    }

    try {
      setActionLoading(id)
      const response = await axios.patch('/api/subscription', { id, status: newStatus })
      
      if (response.data.success) {
        setSubscriptions(prevSubs =>
          prevSubs.map(sub =>
            sub._id === id ? { ...sub, status: newStatus } : sub
          )
        )
        toast.success(`Subscription marked as ${newStatus}`)
        // Refresh stats
        fetchSubscriptions(pagination.currentPage, statusFilter, searchTerm)
      } else {
        toast.error(response.data.msg || 'Failed to update subscription')
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Error updating subscription')
    } finally {
      setActionLoading(null)
    }
  }

  // Delete subscription
  const deleteSubscription = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this subscription?')) {
      return
    }

    try {
      setActionLoading(id)
      const response = await axios.delete(`/api/subscription?id=${id}`)
      
      if (response.data.success) {
        setSubscriptions(prevSubs => prevSubs.filter(sub => sub._id !== id))
        toast.success('Subscription deleted successfully')
        // Refresh stats
        fetchSubscriptions(pagination.currentPage, statusFilter, searchTerm)
      } else {
        toast.error(response.data.msg || 'Failed to delete subscription')
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
      toast.error('Error deleting subscription')
    } finally {
      setActionLoading(null)
    }
  }

  // Export subscriptions (CSV format)
  const exportSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscription?limit=1000')
      if (response.data.success) {
        const csvData = convertToCSV(response.data.data)
        downloadCSV(csvData, 'subscriptions.csv')
        toast.success('Subscriptions exported successfully')
        setShowExportModal(false)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export subscriptions')
    }
  }

  // Convert data to CSV
  const convertToCSV = (data) => {
    const headers = ['Email', 'Status', 'Subscription Date', 'Source', 'IP Address']
    const csvContent = [
      headers.join(','),
      ...data.map(sub => [
        sub.email,
        sub.status,
        formatDate(sub.createdAt),
        sub.source || 'website',
        sub.ipAddress || 'unknown'
      ].join(','))
    ].join('\n')
    
    return csvContent
  }

  // Download CSV file
  const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'unsubscribed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Handle search and filter
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSubscriptions(1, statusFilter, searchTerm)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex flex-col px-5 sm:px-12 pt-5 w-full">
        <h1 className="text-xl font-semibold mb-8">Email Subscriptions</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-5 sm:px-12 pt-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-xl font-semibold mb-4 sm:mb-0">Email Subscriptions</h1>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Export Subscriptions
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-black p-4 text-center">
          <h3 className="text-2xl font-bold text-black">{stats.total}</h3>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 text-center">
          <h3 className="text-2xl font-bold text-green-600">{stats.active}</h3>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 text-center">
          <h3 className="text-2xl font-bold text-yellow-600">{stats.inactive}</h3>
          <p className="text-sm text-gray-600">Inactive</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 text-center">
          <h3 className="text-2xl font-bold text-red-600">{stats.unsubscribed}</h3>
          <p className="text-sm text-gray-600">Unsubscribed</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No subscriptions found</p>
          {searchTerm || statusFilter ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
              }}
              className="mt-4 text-black underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-4 py-3 text-left">Email</th>
                  <th className="border border-black px-4 py-3 text-left">Status</th>
                  <th className="border border-black px-4 py-3 text-left">Subscribed Date</th>
                  <th className="border border-black px-4 py-3 text-left">Source</th>
                  <th className="border border-black px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="border border-black px-4 py-3">
                      <div className="font-medium">{subscription.email}</div>
                      {subscription.ipAddress && (
                        <div className="text-xs text-gray-500">IP: {subscription.ipAddress}</div>
                      )}
                    </td>
                    <td className="border border-black px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(subscription.status)}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </td>
                    <td className="border border-black px-4 py-3 text-sm">
                      {formatDate(subscription.createdAt)}
                    </td>
                    <td className="border border-black px-4 py-3 text-sm">
                      {subscription.source || 'Website'}
                    </td>
                    <td className="border border-black px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        {subscription.status !== 'active' && (
                          <button
                            onClick={() => updateSubscriptionStatus(subscription._id, 'active')}
                            disabled={actionLoading === subscription._id}
                            className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            Activate
                          </button>
                        )}
                        {subscription.status !== 'unsubscribed' && (
                          <button
                            onClick={() => updateSubscriptionStatus(subscription._id, 'unsubscribed')}
                            disabled={actionLoading === subscription._id}
                            className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                          >
                            Unsubscribe
                          </button>
                        )}
                        <button
                          onClick={() => deleteSubscription(subscription._id)}
                          disabled={actionLoading === subscription._id}
                          className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === subscription._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="bg-white border border-black p-4 rounded shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm break-all">{subscription.email}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(subscription.createdAt)}</p>
                    {subscription.ipAddress && (
                      <p className="text-xs text-gray-500">IP: {subscription.ipAddress}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(subscription.status)} ml-2`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {subscription.status !== 'active' && (
                    <button
                      onClick={() => updateSubscriptionStatus(subscription._id, 'active')}
                      disabled={actionLoading === subscription._id}
                      className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Activate
                    </button>
                  )}
                  {subscription.status !== 'unsubscribed' && (
                    <button
                      onClick={() => updateSubscriptionStatus(subscription._id, 'unsubscribed')}
                      disabled={actionLoading === subscription._id}
                      className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      Unsubscribe
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubscription(subscription._id)}
                    disabled={actionLoading === subscription._id}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === subscription._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => fetchSubscriptions(pagination.currentPage - 1, statusFilter, searchTerm)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => fetchSubscriptions(pagination.currentPage + 1, statusFilter, searchTerm)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {subscriptions.length} of {pagination.totalCount} subscriptions
          </div>
        </>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded border border-black max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Export Subscriptions</h3>
            <p className="text-gray-600 mb-6">
              This will export all subscriptions (up to 1000) to a CSV file including email addresses, 
              status, subscription dates, and source information.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={exportSubscriptions}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default page