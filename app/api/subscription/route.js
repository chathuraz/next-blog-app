import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SubscriptionModel from '@/lib/models/SubscriptionModel'
import { headers } from 'next/headers'

// POST method to create a new subscription
export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { email } = body
    
    // Validate email
    if (!email) {
      return NextResponse.json({
        success: false,
        msg: "Email is required"
      }, { status: 400 })
    }
    
    // Get client info
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    
    // Check if email already exists
    const existingSubscription = await SubscriptionModel.findOne({ email: email.toLowerCase() })
    
    if (existingSubscription) {
      if (existingSubscription.status === 'unsubscribed') {
        // Reactivate unsubscribed email
        existingSubscription.status = 'active'
        existingSubscription.subscriptionDate = new Date()
        existingSubscription.unsubscribedDate = undefined
        await existingSubscription.save()
        
        return NextResponse.json({
          success: true,
          msg: "Welcome back! Your subscription has been reactivated.",
          data: existingSubscription
        })
      } else {
        return NextResponse.json({
          success: false,
          msg: "Email is already subscribed"
        }, { status: 409 })
      }
    }
    
    // Create new subscription
    const subscriptionData = {
      email: email.toLowerCase(),
      ipAddress,
      userAgent,
      source: 'website'
    }
    
    const newSubscription = await SubscriptionModel.create(subscriptionData)
    
    return NextResponse.json({
      success: true,
      msg: "Successfully subscribed to newsletter!",
      data: newSubscription
    })
    
  } catch (error) {
    console.error('Subscription error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        msg: "Email is already subscribed"
      }, { status: 409 })
    }
    
    return NextResponse.json({
      success: false,
      msg: "Error processing subscription: " + error.message
    }, { status: 500 })
  }
}

// GET method to retrieve all subscriptions
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 50
    
    // Build query filter
    let filter = {}
    if (status && ['active', 'inactive', 'unsubscribed'].includes(status)) {
      filter.status = status
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Get subscriptions with pagination
    const subscriptions = await SubscriptionModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    
    // Get total count for pagination info
    const totalCount = await SubscriptionModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)
    
    // Get status counts
    const statusCounts = await SubscriptionModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    const stats = {
      total: totalCount,
      active: statusCounts.find(s => s._id === 'active')?.count || 0,
      inactive: statusCounts.find(s => s._id === 'inactive')?.count || 0,
      unsubscribed: statusCounts.find(s => s._id === 'unsubscribed')?.count || 0
    }
    
    return NextResponse.json({
      success: true,
      data: subscriptions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats
    })
    
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json({
      success: false,
      msg: "Error fetching subscriptions: " + error.message
    }, { status: 500 })
  }
}

// DELETE method to remove a subscription
export async function DELETE(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        msg: "Subscription ID is required"
      }, { status: 400 })
    }
    
    const deletedSubscription = await SubscriptionModel.findByIdAndDelete(id)
    
    if (!deletedSubscription) {
      return NextResponse.json({
        success: false,
        msg: "Subscription not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      msg: "Subscription deleted successfully",
      data: deletedSubscription
    })
    
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json({
      success: false,
      msg: "Error deleting subscription: " + error.message
    }, { status: 500 })
  }
}

// PATCH method to update subscription status
export async function PATCH(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json({
        success: false,
        msg: "ID and status are required"
      }, { status: 400 })
    }
    
    if (!['active', 'inactive', 'unsubscribed'].includes(status)) {
      return NextResponse.json({
        success: false,
        msg: "Invalid status. Must be: active, inactive, or unsubscribed"
      }, { status: 400 })
    }
    
    const updateData = { status }
    if (status === 'unsubscribed') {
      updateData.unsubscribedDate = new Date()
    } else if (status === 'active') {
      updateData.unsubscribedDate = undefined
    }
    
    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!updatedSubscription) {
      return NextResponse.json({
        success: false,
        msg: "Subscription not found"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      msg: "Subscription status updated successfully",
      data: updatedSubscription
    })
    
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({
      success: false,
      msg: "Error updating subscription: " + error.message
    }, { status: 500 })
  }
}