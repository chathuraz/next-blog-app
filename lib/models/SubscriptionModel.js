import mongoose from 'mongoose'

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'unsubscribed'],
    default: 'active'
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  unsubscribedDate: {
    type: Date
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
})

// Add index for better query performance
SubscriptionSchema.index({ email: 1 })
SubscriptionSchema.index({ status: 1 })
SubscriptionSchema.index({ createdAt: -1 })

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema)