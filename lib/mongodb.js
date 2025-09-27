import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

console.log('MongoDB URI check:', MONGODB_URI ? 'URI found' : 'URI missing')

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

async function connectDB() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB')
      return mongoose
    }

    // Disconnect if there's a bad connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    console.log('Connecting to MongoDB Atlas...')
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    console.log('Connected to MongoDB Atlas successfully')
    return connection
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    throw error
  }
}

export default connectDB