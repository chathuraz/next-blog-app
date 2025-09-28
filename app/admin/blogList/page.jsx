'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 10

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/blog')
      if (response.data.success) {
        setBlogs(response.data.data)
      } else {
        toast.error('Failed to fetch blogs')
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Error fetching blogs')
    } finally {
      setLoading(false)
    }
  }

  // Delete blog
  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return
    }

    try {
      setDeleteLoading(id)
      const response = await axios.delete(`/api/blog?id=${id}`)
      if (response.data.success) {
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id))
        toast.success('Blog deleted successfully')
      } else {
        toast.error(response.data.msg || 'Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Error deleting blog')
    } finally {
      setDeleteLoading(null)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Filter and search blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === '' || blog.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterCategory])

  if (loading) {
    return (
      <div className="flex flex-col px-5 sm:px-12 pt-5 w-full">
        <h1 className="text-xl font-semibold mb-8">All Blogs</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-5 sm:px-12 pt-5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-xl font-semibold mb-4 sm:mb-0">All Blogs ({filteredBlogs.length})</h1>
        <Link 
          href="/admin/addProduct"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Add New Blog
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blogs by title, description, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          >
            <option value="">All Categories</option>
            <option value="Startup">Startup</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      {currentBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs found</p>
          {searchTerm || filterCategory ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('')
              }}
              className="mt-4 text-black underline"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/admin/addProduct"
              className="mt-4 inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            >
              Create your first blog
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-4 py-3 text-left">Image</th>
                  <th className="border border-black px-4 py-3 text-left">Title</th>
                  <th className="border border-black px-4 py-3 text-left">Category</th>
                  <th className="border border-black px-4 py-3 text-left">Author</th>
                  <th className="border border-black px-4 py-3 text-left">Date</th>
                  <th className="border border-black px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="border border-black px-4 py-3">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="border border-black px-4 py-3">
                      <div>
                        <p className="font-medium">{truncateText(blog.title, 50)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {truncateText(blog.description, 80)}
                        </p>
                      </div>
                    </td>
                    <td className="border border-black px-4 py-3">
                      <span className="px-2 py-1 bg-black text-white text-xs rounded">
                        {blog.category}
                      </span>
                    </td>
                    <td className="border border-black px-4 py-3">
                      <div className="flex items-center gap-2">
                        {blog.author_img && (
                          <Image
                            src={blog.author_img}
                            alt={blog.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm">{blog.author}</span>
                      </div>
                    </td>
                    <td className="border border-black px-4 py-3 text-sm">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="border border-black px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/blogs/${blog._id}`}
                          target="_blank"
                          className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {currentBlogs.map((blog) => (
              <div key={blog._id} className="bg-white border border-black p-4 rounded shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-2">{truncateText(blog.title, 40)}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {truncateText(blog.description, 60)}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-black text-white text-xs rounded">
                        {blog.category}
                      </span>
                      <span className="text-xs text-gray-500">{blog.author}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{formatDate(blog.createdAt)}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/blogs/${blog._id}`}
                        target="_blank"
                        className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        disabled={deleteLoading === blog._id}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded transition-colors ${
                        currentPage === page
                          ? 'bg-black text-white border-black'
                          : 'border-black hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-black rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + blogsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blogs
          </div>
        </>
      )}
    </div>
  )
}

export default page