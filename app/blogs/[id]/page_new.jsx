'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import Footer from '@/Components/Footer'
import Link from 'next/link'
import axios from 'axios'

const page = ({params}) => {
  const resolvedParams = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      // First, get all blogs from API
      const response = await axios.get('/api/blog');
      
      if (response.data.success) {
        const blogs = response.data.data;
        // Find the blog with matching ID
        const blog = blogs.find(blog => blog._id === resolvedParams.id);
        
        if (blog) {
          setData(blog);
        } else {
          setError('Blog not found');
        }
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (resolvedParams?.id) {
      fetchBlogData(); 
    }
  }, [resolvedParams?.id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <div className='text-xl text-red-500 mb-4'>{error}</div>
        <Link href='/' className='bg-black text-white px-4 py-2 rounded'>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <div className='text-xl text-gray-500 mb-4'>Blog not found</div>
        <Link href='/' className='bg-black text-white px-4 py-2 rounded'>
          Back to Home
        </Link>
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
            {data.title}
          </h1>

          {data.author_img && (
            <Image className='mx-auto mt-6 border border-white rounded-full' src={data.author_img} width={60} height={60} alt=''/>
          )}
          {data.author && (
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
          )}
        </div>
      </div>

      {data.image && (
        <div className='px-5'>
          <div className='max-w-[900px] w-full mx-auto -mt-24 sm:-mt-28 md:-mt-32 lg:-mt-40 mb-12 relative z-10'>
            <Image
              src={data.image}
              width={1280}
              height={720}
              alt={data.title || 'Blog cover image'}
              className='w-full h-auto border-4 border-white rounded-md shadow'
              priority
              sizes='(min-width: 1024px) 900px, (min-width: 768px) 700px, 100vw'
            />
          </div>
        </div>
      )}

      <div className='mx-5 max-w-[800px] md:mx-auto mb-10'>
        <div className='blog-content mb-8'>
          <h2 className='text-2xl font-bold mb-4'>Description</h2>
          <p className='text-lg leading-relaxed whitespace-pre-wrap'>{data.description}</p>
        </div>

        <div className='my-24'>
          <p className='text-black font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-2'>
            <Image src={assets.facebook_icon} width={50} alt='Facebook'/>
            <Image src={assets.twitter_icon} width={50} alt='Twitter'/>
            <Image src={assets.googleplus_icon} width={50} alt='Google Plus'/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default page