import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SubscriptionModel from '@/lib/models/SubscriptionModel'
import crypto from 'crypto'

// GET method to unsubscribe with token
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    
    if (!token || !email) {
      return NextResponse.json({
        success: false,
        msg: "Invalid unsubscribe link"
      }, { status: 400 })
    }
    
    // Find subscription by email
    const subscription = await SubscriptionModel.findOne({ 
      email: email.toLowerCase() 
    })
    
    if (!subscription) {
      return NextResponse.json({
        success: false,
        msg: "Subscription not found"
      }, { status: 404 })
    }
    
    // Generate expected token for verification
    const expectedToken = crypto
      .createHash('sha256')
      .update(subscription._id.toString() + subscription.email + process.env.UNSUBSCRIBE_SECRET)
      .digest('hex')
    
    if (token !== expectedToken) {
      return NextResponse.json({
        success: false,
        msg: "Invalid unsubscribe token"
      }, { status: 400 })
    }
    
    // Update subscription status
    subscription.status = 'unsubscribed'
    subscription.unsubscribedDate = new Date()
    await subscription.save()
    
    // Redirect to unsubscribe success page
    return NextResponse.redirect(new URL('/unsubscribe/success', request.url))
    
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({
      success: false,
      msg: "Error processing unsubscribe request"
    }, { status: 500 })
  }
}