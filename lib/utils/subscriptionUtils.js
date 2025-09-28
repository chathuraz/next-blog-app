import crypto from 'crypto'

/**
 * Generate a secure unsubscribe token for email links
 * @param {string} subscriptionId - The subscription ID
 * @param {string} email - The subscriber's email
 * @returns {string} - The secure token
 */
export const generateUnsubscribeToken = (subscriptionId, email) => {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'default-secret-key'
  return crypto
    .createHash('sha256')
    .update(subscriptionId + email + secret)
    .digest('hex')
}

/**
 * Generate a complete unsubscribe URL
 * @param {string} subscriptionId - The subscription ID
 * @param {string} email - The subscriber's email
 * @param {string} baseUrl - The base URL of the application
 * @returns {string} - The complete unsubscribe URL
 */
export const generateUnsubscribeUrl = (subscriptionId, email, baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') => {
  const token = generateUnsubscribeToken(subscriptionId, email)
  return `${baseUrl}/api/unsubscribe?token=${token}&email=${encodeURIComponent(email)}`
}

/**
 * Format date for display
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatSubscriptionDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get subscription statistics
 * @param {Array} subscriptions - Array of subscription objects
 * @returns {Object} - Statistics object
 */
export const getSubscriptionStats = (subscriptions) => {
  const stats = {
    total: subscriptions.length,
    active: 0,
    inactive: 0,
    unsubscribed: 0,
    thisMonth: 0,
    thisWeek: 0
  }

  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()))

  subscriptions.forEach(sub => {
    // Count by status
    stats[sub.status] = (stats[sub.status] || 0) + 1

    // Count by time period
    const createdAt = new Date(sub.createdAt)
    if (createdAt >= thisMonth) {
      stats.thisMonth++
    }
    if (createdAt >= thisWeek) {
      stats.thisWeek++
    }
  })

  return stats
}

/**
 * Export subscription data to CSV format
 * @param {Array} subscriptions - Array of subscription objects
 * @returns {string} - CSV formatted string
 */
export const exportSubscriptionsToCSV = (subscriptions) => {
  const headers = ['Email', 'Status', 'Subscribed Date', 'Source', 'IP Address', 'Unsubscribed Date']
  
  const csvRows = subscriptions.map(sub => [
    sub.email,
    sub.status,
    formatSubscriptionDate(sub.createdAt),
    sub.source || 'website',
    sub.ipAddress || 'unknown',
    sub.unsubscribedDate ? formatSubscriptionDate(sub.unsubscribedDate) : ''
  ])

  return [headers, ...csvRows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n')
}