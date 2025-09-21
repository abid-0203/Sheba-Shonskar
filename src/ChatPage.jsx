// File: src/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, X, ArrowLeft, Phone, User } from 'lucide-react';
import axios from 'axios';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userType, setUserType] = useState('citizen'); // 'citizen' or 'admin'
  const messagesEndRef = useRef(null);

  // Get user info and type from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      navigate('/login');
      return;
    }
    
    setUserInfo(user);
    setUserType(user.role || 'citizen');
    fetchMessages();
  }, [navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/chat/messages', {
        headers: { 'x-auth-token': token }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const messageData = {
        text: newMessage,
        senderType: userType,
        senderId: userInfo_id,
        senderName: `${userInfo.firstName} ${userInfo.lastName}`
      };

      const response = await axios.post('http://localhost:5000/api/chat/messages', messageData, {
        headers: { 'x-auth-token': token }
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const goBack = () => {
    if (userType === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/citizen-dashboard');
    }
  };

  if (!userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    {userType === 'admin' ? 'Admin Support Chat' : 'Chat with Admin'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {userType === 'admin' ? 'Help citizens with their queries' : 'Get help from our support team'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === userInfo_id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {!isOwn && (
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {message.senderName} ({message.senderType})
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                rows="1"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Admin */}
      {userType === 'admin' && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Responses</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Thank you for contacting us. We'll look into your issue.",
                "Your complaint has been forwarded to the relevant department.",
                "We appreciate your patience. This issue is being resolved.",
                "Could you please provide more details about the problem?",
                "Your issue has been successfully resolved. Thank you!"
              ].map((quickResponse, index) => (
                <button
                  key={index}
                  onClick={() => setNewMessage(quickResponse)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {quickResponse.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;