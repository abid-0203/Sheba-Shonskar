// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   GET /api/chat/messages
// @desc    Get all chat messages
// @access  Private
router.get('/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 }) // Oldest first for chat display
      .populate('senderId', 'firstName lastName role')
      .populate('replyTo', 'text senderName');
    
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/chat/messages
// @desc    Create a new chat message
// @access  Private
router.post('/messages', auth, async (req, res) => {
  try {
    const { text, senderType, attachments, replyTo } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ msg: 'Message text is required' });
    }

    // Get user info
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const message = new Message({
      text: text.trim(),
      senderId: req.user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderType: user.role || 'citizen', // Use user's actual role
      attachments: attachments || [],
      replyTo: replyTo || null
    });

    await message.save();
    
    // Populate the message before sending response
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName role')
      .populate('replyTo', 'text senderName');
    
    res.json(populatedMessage);
  } catch (err) {
    console.error('Error creating message:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get count of unread messages for admin
// @access  Private (Admin only)
router.get('/unread-count', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Only admins can check unread count
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Count messages from citizens that are not read
    const unreadCount = await Message.countDocuments({
      senderType: 'citizen',
      isRead: false
    });
    
    res.json({ count: unreadCount });
  } catch (err) {
    console.error('Error fetching unread count:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/chat/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.patch('/messages/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Mark as read and add to readBy array if not already there
    const alreadyRead = message.readBy.find(read => read.userId.toString() === req.user.id);
    
    if (!alreadyRead) {
      message.readBy.push({
        userId: req.user.id,
        readAt: new Date()
      });
      message.isRead = true;
      await message.save();
    }
    
    res.json({ msg: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message as read:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/chat/messages/:id
// @desc    Delete a chat message (Admin only or message owner)
// @access  Private
router.delete('/messages/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if user is admin or message owner
    const isAdmin = user && user.role === 'admin';
    const isOwner = message.senderId.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Message.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    console.error('Error deleting message:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/chat/conversations
// @desc    Get conversation summary for admin
// @access  Private (Admin only)
router.get('/conversations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    // Get unique users who have sent messages
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: '$senderId',
          lastMessage: { $last: '$text' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$senderType', 'citizen'] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          userRole: '$user.role',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;