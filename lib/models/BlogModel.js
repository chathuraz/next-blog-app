import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Startup', 'Technology', 'Lifestyle']
  },
  author: {
    type: String,
    required: true
  },
  author_img: {
    type: String,
    required: true
  },
  image: {
    type: String
  }
}, {
  timestamps: true  // This adds createdAt and updatedAt automatically
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)