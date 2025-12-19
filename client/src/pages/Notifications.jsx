import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          title: 'Property Listed',
          message: 'Your property "Modern Apartment" has been successfully listed.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          type: 'success'
        },
        {
          id: 2,
          title: 'New Inquiry',
          message: 'Someone is interested in your property "Downtown Studio".',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: false,
          type: 'info'
        },
        {
          id: 3,
          title: 'Profile Updated',
          message: 'Your profile information has been successfully updated.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true,
          type: 'success'
        },
        {
          id: 4,
          title: 'Promotion',
          message: 'New properties matching your search criteria have been added.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: true,
          type: 'info'
        },
        {
          id: 5,
          title: 'Review Posted',
          message: 'A new review has been posted for your property.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
          type: 'warning'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Notifications</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-lg animate-pulse">
                  <div className="h-6 bg-[#252525] rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-[#252525] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.read
                      ? 'bg-[#1a1a1a] border-[#252525]'
                      : 'bg-[#1a1a1a] border-purple-500/30 ring-1 ring-purple-500/20'
                  } hover:border-purple-500/50 group`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        {!notification.read && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          notification.type === 'success' ? 'bg-green-900/30 text-green-400' :
                          notification.type === 'info' ? 'bg-blue-900/30 text-blue-400' :
                          'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-[#252525] rounded transition-colors"
                          title="Mark as read"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-900/30 rounded transition-colors"
                        title="Delete notification"
                      >
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
