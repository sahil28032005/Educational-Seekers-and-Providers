import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        setNotifications,
        unreadCount, 
        setUnreadCount,
        markAsRead, 
        markAllAsRead, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};