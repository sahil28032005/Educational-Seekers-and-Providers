import { useEffect } from 'react';
import { toast } from 'react-toastify';

const SocketNotificationListener = ({ socket }) => {
  useEffect(() => {
    if (!socket) {
      console.log('Socket is not initialized');
      return;
    }

    console.log("Setting up notification listener in SocketNotificationListener");
    
    // Function to display the toast
    const handleNotification = (data) => {
      console.log("SocketNotificationListener received notification:", data);
      
      // Force a toast to display regardless of data structure
      toast.success(
        <div>
          <h4 className="font-bold">{data.title || "New Notification"}</h4>
          <p>{data.message || "You have a new notification"}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    };

    // Add the notification listener
    socket.on("notification", handleNotification);

    // Test toast to verify react-toastify is working
    toast.info("Socket notification listener initialized");

    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up notification listener");
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return null;
};

export default SocketNotificationListener;