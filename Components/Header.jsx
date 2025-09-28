import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Header = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e) => {
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
      setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <div className='py-5 px-5 md:px-10 lg:px-28'>
        <div className='flex justify-between items-center'>
            <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>Get Started <Image src={assets.arrow} alt='arrow'/></button>
        </div>
        <div className='text-center my-8'>
            <h1 className='text-3xl sm:text-5xl font-medium'>Latest Blogs</h1>
            <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt repellat cumque harum? Adipisci distinctio ratione maxime beatae fugiat non similique molestiae et impedit voluptate labore, magnam odio consectetur eos rerum!</p>
            <form onSubmit={handleSubscribe} className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]'>
                <input 
                  type="email" 
                  placeholder='Enter your email' 
                  className='pl-4 outline-none flex-1'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type='submit' 
                  disabled={loading}
                  className='border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default Header
