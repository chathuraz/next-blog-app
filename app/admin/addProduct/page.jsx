'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'  // Add this import

const page = () => {
  const [image, setImage] = useState(false);

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Startup",
    author: "Alex Bennett",
    author_img: "/author_img.png"
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data=>({...data, [name]:value}));
    console.log(data);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('author', data.author);
      formData.append('author_img', data.author_img);
      formData.append('image', image);
      
      console.log('Submitting form...');
      
      const response = await axios.post('/api/blog', formData);
      
      console.log('Response:', response.data);
      
      if(response.data.success){
        toast.success(response.data.msg); // Changed from .message to .msg
        // Reset form
        setData({
          title: "",
          description: "",
          category: "Startup",
          author: "Alex Bennett",
          author_img: "/author_img.png"
        });
        setImage(false);
      } else {
        toast.error(response.data.msg || "Error adding blog");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.msg || "Network error");
    }
  }

  return (
    <>
    <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
      <p className='text-xl'>Upload Thumbnail</p>
      <label htmlFor="image">
        <Image 
          className='mt-4 cursor-pointer' 
          src={!image ? assets.upload_area : URL.createObjectURL(image)} 
          width={140} 
          height={70} 
          alt=''
        />
      </label>
      <input 
        onChange={(e) => setImage(e.target.files[0])} 
        type="file" 
        id='image' 
        hidden 
        required 
      />
      <p className='text-xl mt-4'>Blog Title</p>
      <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type='text' placeholder='Type here' required/>
      <p className='text-xl mt-4'>Blog Description</p>
      <textarea name='description' onChange={onChangeHandler} value={data.description} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' placeholder='Write content here' rows={6} required/>
      <p className='text-xl mt-4'>Blog Category</p>
      <select name='category' onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
        <option value="Startup">Startup</option>
        <option value="Technology">Technology</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>
      <br />
      <button type='submit' className='mt-8 w-40 h-12 bg-black text-white'>ADD</button>
    </form>
    </>
  )
}

export default page