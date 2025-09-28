'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SubscriptionSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white border border-black p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">🎉 Welcome to Our Newsletter!</h1>
          <p className="text-gray-600">
            Thank you for subscribing! You'll receive our latest blog posts and exclusive content directly in your inbox.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <h3 className="font-semibold text-black mb-2">What to expect:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Weekly digest of new blog posts</li>
            <li>• Exclusive content and insights</li>
            <li>• Early access to new features</li>
            <li>• Tips and tutorials</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors font-semibold"
          >
            Continue Reading Blogs
          </Link>
          
          <Link 
            href="/blogs"
            className="block w-full border border-black text-black py-3 px-6 rounded hover:bg-gray-100 transition-colors"
          >
            Browse All Posts
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Didn't mean to subscribe? You can unsubscribe at any time by clicking the unsubscribe link in our emails.
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

export default SubscriptionSuccess