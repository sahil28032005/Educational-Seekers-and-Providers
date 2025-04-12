import { useEffect } from 'react';
import { toast } from 'react-toastify';

const SocketNotificationListener = ({ socket }) => {
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      console.log("Received notification:", data);
      
      toast.success(
        <div>
          <h4 className="font-bold">{data.title || "New Notification"}</h4>
          <p>{data.message}</p>
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

    // Listen for notification events
    socket.on("notification", handleNotification);

    // Cleanup listener on unmount
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  return null;
};

export default SocketNotificationListener;