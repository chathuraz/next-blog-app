import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import connectDB from '@/lib/mongodb'
import BlogModel from '@/lib/models/BlogModel'

export async function POST(request) {
  try {
    console.log('API route called')
    
    // Connect to MongoDB Atlas
    await connectDB()
    console.log('DB Connected')
    
    const formData = await request.formData()
    
    const file = formData.get('image')
    const title = formData.get('title')
    const description = formData.get('description')
    const category = formData.get('category')
    const author = formData.get('author')
    const author_img = formData.get('author_img')

    console.log('Received data:', { title, description, category, author })

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({
        success: false,
        msg: "Title and description are required"
      }, { status: 400 })
    }

    let imagePath = null

    // Handle image upload if file exists
    if (file && file.size > 0) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        // Save image file
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filepath = path.join(uploadDir, filename)
        
        await writeFile(filepath, buffer)
        imagePath = `/uploads/${filename}`
        console.log('Image saved:', imagePath)
      } catch (imageError) {
        console.error('Image upload error:', imageError)
        return NextResponse.json({
          success: false,
          msg: "Error uploading image"
        }, { status: 500 })
      }
    }

    // Create blog data object for MongoDB
    const blogData = {
      title,
      description,
      category: category || 'Startup',
      author: author || 'Alex Bennett',
      author_img: author_img || '/author_img.png',
      image: imagePath
    }

    console.log("Blog data created:", blogData)

    // Save to MongoDB Atlas
    try {
      const savedBlog = await BlogModel.create(blogData)
      console.log("Blog saved to MongoDB Atlas with ID:", savedBlog._id)
      
      return NextResponse.json({
        success: true,
        msg: "Blog saved to MongoDB Atlas successfully!",
        data: savedBlog
      })
    } catch (dbError) {
      console.error('Database save error:', dbError)
      return NextResponse.json({
        success: false,
        msg: "Database error: " + dbError.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      msg: "Server error: " + error.message
    }, { status: 500 })
  }
}

// GET method to retrieve blogs from MongoDB Atlas
export async function GET() {
  try {
    await connectDB()
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length
    })
  } catch (error) {
    console.error('Database fetch error:', error)
    return NextResponse.json({
      success: false,
      msg: "Error fetching blogs: " + error.message
    }, { status: 500 })
  }
}

// DELETE method to delete a blog from MongoDB Atlas
export async function DELETE(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        msg: "Blog ID is required"
      }, { status: 400 })
    }
    
    const deletedBlog = await BlogModel.findByIdAndDelete(id)
    
    if (!deletedBlog) {
      return NextResponse.json({
        success: false,
        msg: "Blog not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      msg: "Blog deleted successfully",
      data: deletedBlog
    })
    
  } catch (error) {
    console.error('Database delete error:', error)
    return NextResponse.json({
      success: false,
      msg: "Error deleting blog: " + error.message
    }, { status: 500 })
  }
}