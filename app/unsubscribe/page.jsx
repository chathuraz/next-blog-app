'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const UnsubscribePage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUnsubscribe = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      
      // First find the subscription by email
      const findResponse = await axios.get('/api/subscription')
      const subscriptions = findResponse.data.data || []
      const subscription = subscriptions.find(sub => sub.email.toLowerCase() === email.toLowerCase())
      
      if (!subscription) {
        toast.error('Email address not found in our subscription list')
        return
      }

      // Update subscription status to unsubscribed
      const response = await axios.patch('/api/subscription', { 
        id: subscription._id, 
        status: 'unsubscribed' 
      })
      
      if (response.data.success) {
        setSuccess(true)
        toast.success('Successfully unsubscribed from our newsletter')
      } else {
        toast.error(response.data.msg || 'Failed to unsubscribe')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      toast.error('Failed to process unsubscribe request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-white border border-black p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">😢 You've Been Unsubscribed</h1>
            <p className="text-gray-600 mb-4">
              We're sorry to see you go! You have been successfully unsubscribed from our newsletter.
            </p>
            <p className="text-sm text-gray-500">
              You won't receive any more emails from us, but you can always resubscribe anytime.
            </p>
          </div>

          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors font-semibold"
            >
              Back to Homepage
            </Link>
            
            <Link 
              href="/blogs"
              className="block w-full border border-black text-black py-3 px-6 rounded hover:bg-gray-100 transition-colors"
            >
              Continue Reading Blogs
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Changed your mind? You can subscribe again from our homepage or any blog post.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors">
            <Image src={assets.logo} width={120} alt="Logo" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white border border-black p-8 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">Unsubscribe from Newsletter</h1>
          <p className="text-gray-600">
            We're sorry to see you go. Enter your email address below to unsubscribe from our newsletter.
          </p>
        </div>

        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-6 rounded hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Unsubscribe'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-black hover:underline text-sm"
          >
            ← Back to Homepage
          </Link>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Before you go:</strong> Instead of unsubscribing completely, you can also adjust your email preferences or reduce the frequency of emails by contacting us.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors">
          <Image src={assets.logo} width={120} alt="Logo" />
        </Link>
      </div>
    </div>
  )
}

export default UnsubscribePage