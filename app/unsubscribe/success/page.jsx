'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const UnsubscribeSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white border border-black p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Successfully Unsubscribed</h1>
          <p className="text-gray-600">
            You have been successfully unsubscribed from our newsletter. We're sorry to see you go!
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <h3 className="font-semibold text-black mb-2">What this means:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You won't receive any more newsletter emails</li>
            <li>• Your email has been removed from our mailing list</li>
            <li>• You can still visit our website anytime</li>
            <li>• You can resubscribe whenever you want</li>
          </ul>
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

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Miss us already?</strong> You can resubscribe anytime from our homepage or any blog post. No hard feelings! 😊
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

export default UnsubscribeSuccess