import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import io from 'socket.io-client';

const API_BASE_URL = 'https://project-backend-5sjw.onrender.com';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to Socket.IO
    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      console.log('✅ Connected to notification server');
    });

    socket.on('newContactMessage', (data) => {
      console.log('🔔 New contact message received:', data);
      const newNotification = {
        id: Date.now(),
        type: 'contact',
        title: 'New Contact Message',
        message: `${data.name} sent a message: ${data.subject}`,
        data: data,
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show notification banner
      showNotificationBanner(newNotification);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const showNotificationBanner = (notification) => {
    // Create a banner notification
    const banner = document.createElement('div');
    banner.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    banner.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <div class="font-semibold">${notification.title}</div>
          <div class="text-sm opacity-90">${notification.message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (banner.parentElement) {
        banner.remove();
      }
    }, 5000);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 