'use client'
import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import React, { use, useEffect } from 'react'
import Footer from '@/Components/Footer'
import Link from 'next/link'

const page = ({params}) => {
  const resolvedParams = use(params);
  const [data,setData] = React.useState(null);

  const fetchBlogData = () => {
    for (let i = 0; i < blog_data.length; i++) {
      if (Number(resolvedParams.id) == blog_data[i].id) {
        setData(blog_data[i]);
        break;
      }
    }
  }

  useEffect(() => { fetchBlogData(); }, [])

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
            <h1 className='my-8 text-[26px] font-semibold'>Introduction</h1>
            <p>{data.description}</p>
            <h3 className='my-5 text-[18px] font-semibold'>Step 1: Self-Reflection and Global Setting</h3>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>

            <h3 className='my-5 text-[18px] font-semibold'>Step 2: Self-Reflection and Global Setting</h3>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>

            <h3 className='my-5 text-[18px] font-semibold'>Step 3: Self-Reflection and Global Setting</h3>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>
            <p className='my-3'>Before you can manage your lifestyle, you must have a clear understanding of your current situation and the global context in which you live.</p>

            <h3 className='my-5 text-[18px] font-semibold'>Conclusion</h3>
            <p className='my-3'>Managing your lifestyle is an ongoing process that requires self-awareness, adaptability, and a willingness to change.</p>

            <div className='my-24'>
              <p className='text-black font font-semibold my-4'>Share this article on social media</p>
              <div className='flex'>
                <Image src={assets.facebook_icon} width={50} alt='Facebook'/>
                <Image src={assets.twitter_icon} width={50} alt='Twitter'/>
                <Image src={assets.googleplus_icon} width={50} alt='Google Plus'/>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  )
}

export default page