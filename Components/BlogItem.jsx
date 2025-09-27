import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogItem = ({ title, description, category, image, id, author, createdAt }) => {
  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Truncate description if too long
  const truncateDescription = (desc, maxLength = 100) => {
    if (!desc) return '';
    return desc.length > maxLength ? desc.substring(0, maxLength) + '...' : desc;
  };

  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
        <Link href={`/blogs/${id}`}>
            {image ? (
                <Image 
                    src={image} 
                    alt={title || 'Blog image'} 
                    width={400} 
                    height={400} 
                    className='border-b border-black object-cover h-[200px] w-full'
                />
            ) : (
                <div className='border-b border-black bg-gray-200 h-[200px] w-full flex items-center justify-center'>
                    <span className='text-gray-500'>No Image</span>
                </div>
            )}
        </Link>
        <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
        <div className="p-5">
            <h5 className='mb-2 text-lg font-medium tracking-light text-gray-900'>{title}</h5>
            <p className='mb-3 text-sm tracking-tight text-gray-700'>{truncateDescription(description)}</p>
            
            {(author || createdAt) && (
                <div className='mb-3 text-xs text-gray-500'>
                    {author && <span>By {author}</span>}
                    {author && createdAt && <span> • </span>}
                    {createdAt && <span>{formatDate(createdAt)}</span>}
                </div>
            )}
            
            <Link href={`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center'>
                Read More <Image src={assets.arrow} className='ml-2' alt='' width={12} />
            </Link>
        </div>
    </div>
  )
}

export default BlogItem