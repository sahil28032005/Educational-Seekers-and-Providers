import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';

const SocketNotificationListener = ({ socket }) => {
  const { notifications, setNotifications, setUnreadCount } = useNotifications();

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications from socket
    socket.on('notification', (notification) => {
      // Show toast notification
      toast.info(`${notification.title || 'New Notification'}: ${notification.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Add to notifications list
      const newNotification = {
        id: Date.now(),
        title: notification.title || 'Notification',
        message: notification.message,
        timestamp: new Date(),
        read: false,
        data: notification.data || {}
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Handle socket reconnection
    socket.on('reconnect', () => {
      console.log('Socket reconnected');
      
      // Re-register user with socket server
      const userId = localStorage.getItem('userId');
      if (userId) {
        socket.emit('register', userId);
      }
    });

    // Handle logout event from server
    socket.on('logout', (data) => {
      console.log('Logout event received:', data.message);
      
      // Clear user data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      
      // Redirect to login page
      window.location.href = '/login';
    });

    return () => {
      socket.off('notification');
      socket.off('disconnect');
      socket.off('reconnect');
      socket.off('logout');
    };
  }, [socket, setNotifications, setUnreadCount]);

  return null; // This component doesn't render anything
};

export default SocketNotificationListener;