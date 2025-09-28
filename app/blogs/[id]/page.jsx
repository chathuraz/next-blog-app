'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import Footer from '@/Components/Footer'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'

const page = ({params}) => {
  const resolvedParams = use(params);
  const [data, setData] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog');
      console.log('API Response:', response.data); // Debug log
      
      // The API returns blogs in response.data.data
      const blogs = response.data.data || [];
      console.log('Blogs array:', blogs); // Debug log
      console.log('Looking for ID:', resolvedParams.id); // Debug log
      
      if (Array.isArray(blogs)) {
        const blogData = blogs.find(blog => blog._id === resolvedParams.id);
        console.log('Found blog:', blogData); // Debug log
        
        if (blogData) {
          setData(blogData);
          
          // Get related blogs (same category, excluding current blog)
          const related = blogs
            .filter(blog => blog._id !== resolvedParams.id && blog.category === blogData.category)
            .slice(0, 3);
          setRelatedBlogs(related);
        } else {
          setError('Blog not found');
        }
      } else {
        setError('Invalid blog data format');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Error loading blog');
    } finally {
      setLoading(false);
    }
  }

  // Handle newsletter subscription
  const handleNewsletterSubscription = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setSubscriptionLoading(true)
      const response = await axios.post('/api/subscription', { email })
      
      if (response.data.success) {
        toast.success(response.data.msg)
        setEmail('')
      } else {
        toast.error(response.data.msg)
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.msg)
      } else {
        toast.error('Failed to subscribe. Please try again.')
      }
      console.error('Subscription error:', error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

  // Copy blog URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Blog URL copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy URL')
    }
  }

  useEffect(() => { 
    if (resolvedParams.id) {
      fetchBlogData(); 
    }
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Blog not found</div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28' style={{ backgroundColor: '#e5e7eb' }}>
        <div className='flex justify-between items-center'>
          <Link href='/'>
          <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
          </Link>
          <button className='flex items-center gap-2 font-medium py-1 px-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
            Get Started<Image src={assets.arrow} alt=''/>
          </button>
        </div>

        <div className='text-center mb-16 pt-24 md:pt-40 lg:pt-48' style={{ paddingTop: '12rem' }}>
          <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto leading-tight'>
            {data?.title}
          </h1>

          {data?.author_img && (
            <Image className='mx-auto mt-6 border border-white rounded-full' src={data.author_img} width={60} height={60} alt=''/>
          )}
          {data?.author && (
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
          )}
        </div>
      </div>

      {/* Only render the hero image when we actually have a src */}
      {data?.image && (
        <>
          <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
            <Image
              src={data.image}
              width={1280}
              height={720}
              alt={data.title || 'Blog cover image'}
              className='w-full h-auto border-4 border-white'
              priority
            />
            
            <div className='my-8'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='bg-black text-white px-3 py-1 text-sm rounded'>
                  {data.category}
                </span>
                <span className='text-gray-600 text-sm'>
                  {new Date(data.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <h1 className='text-3xl font-bold mb-6'>{data.title}</h1>
              
              <div className='prose max-w-none'>
                <div className='text-lg leading-relaxed whitespace-pre-line'>
                  {data.description}
                </div>
              </div>
            </div>

            {/* Newsletter Subscription Call-to-Action */}
            <div className='bg-gray-100 border border-black p-6 my-8 text-center'>
              <h3 className='text-xl font-semibold mb-2'>📧 Stay Updated!</h3>
              <p className='text-gray-700 mb-4'>
                Get the latest blog posts delivered straight to your inbox. Join our newsletter for exclusive content and updates.
              </p>
              <form onSubmit={handleNewsletterSubscription} className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscriptionLoading}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black'
                />
                <button
                  type="submit"
                  disabled={subscriptionLoading}
                  className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {subscriptionLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className='text-xs text-gray-600 mt-2'>
                No spam, unsubscribe at any time.
              </p>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className='my-12'>
                <h2 className='text-2xl font-bold mb-6 text-center'>📚 You might also like</h2>
                <div className='grid md:grid-cols-3 gap-6'>
                  {relatedBlogs.map((blog) => (
                    <Link key={blog._id} href={`/blogs/${blog._id}`} className='block group'>
                      <div className='border border-black hover:shadow-[-5px_5px_0px_#000000] transition-shadow bg-white'>
                        {blog.image && (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={400}
                            height={200}
                            className='w-full h-32 object-cover border-b border-black'
                          />
                        )}
                        <div className='p-4'>
                          <span className='bg-black text-white px-2 py-1 text-xs rounded'>
                            {blog.category}
                          </span>
                          <h3 className='font-semibold mt-2 group-hover:underline line-clamp-2'>
                            {blog.title}
                          </h3>
                          <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                            {blog.description}
                          </p>
                          <p className='text-xs text-gray-500 mt-2'>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}


          </div>
          <Footer />
        </>
      )}
    </>
  )
}

export default page