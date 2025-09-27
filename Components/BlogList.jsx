import React, { useState, useEffect } from 'react'
import BlogItem from './BlogItem'
import axios from 'axios'

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch blogs from database
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/blog');
            
            if (response.data.success) {
                setBlogs(response.data.data);
                console.log('Blogs fetched:', response.data.data);
            } else {
                console.error('Failed to fetch blogs:', response.data.msg);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

  return (
    <div>
        <div className='flex justify-center gap-6 my-10'>
            <button onClick={()=>setMenu('All')} className={menu==='All'?'bg-black text-white py-1 px-4 rounded-sm':""}>All</button>
            <button onClick={()=>setMenu('Technology')} className={menu==='Technology'?'bg-black text-white py-1 px-4 rounded-sm':""}>Technology</button>
            <button onClick={()=>setMenu('Startup')} className={menu==='Startup'?'bg-black text-white py-1 px-4 rounded-sm':""}>Startup</button>
            <button onClick={()=>setMenu('Lifestyle')} className={menu==='Lifestyle'?'bg-black text-white py-1 px-4 rounded-sm':""}>Lifestyle</button>
        </div>
        
        {loading ? (
            <div className='flex justify-center items-center py-20'>
                <div className='text-lg'>Loading blogs...</div>
            </div>
        ) : (
            <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
                {blogs.filter((item)=>menu==='All'?true:item.category===menu).map((item, index)=> {
                    return <BlogItem 
                        key={item._id || index} 
                        id={item._id} 
                        image={item.image} 
                        title={item.title} 
                        description={item.description} 
                        category={item.category}
                        author={item.author}
                        createdAt={item.createdAt}
                    />
                })}
                {blogs.filter((item)=>menu==='All'?true:item.category===menu).length === 0 && !loading && (
                    <div className='text-center py-20'>
                        <p className='text-lg text-gray-500'>No blogs found in this category.</p>
                    </div>
                )}
            </div>
        )}
    </div>
  )
}

export default BlogList