import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

const NotificationPopover = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (popoverOpen) {
      loadNotifications();
      const intervalId = setInterval(loadNotifications, 30000); // Update every 30 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [popoverOpen]);

  const toggle = () => setPopoverOpen(!popoverOpen);

  const loadNotifications = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://127.0.0.1:8000/users/api/NotificationsList/?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      const newNotifications = response.data;
      
      // Create a Set to keep track of notification IDs
      const currentNotificationIds = new Set(notifications.map(notif => notif.id));
      const freshNotifications = newNotifications.filter(notif => !currentNotificationIds.has(notif.id));

      setNotifications(prevNotifications => [...prevNotifications, ...freshNotifications]);
      setUnreadCount(freshNotifications.length); // Update unreadCount based on freshNotifications

      // Update hasMore based on response length
      setHasMore(newNotifications.length > 0); 
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="position-relative">
      <button id="notificationIcon" type="button" onClick={toggle} className="btn btn-light position-relative">
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>
      <Popover
        placement="bottom"
        isOpen={popoverOpen}
        target="notificationIcon"
        toggle={toggle}
        ref={popoverRef}
        className="notification-popover"
      >
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverBody
          className="notification-body"
          onScroll={handleScroll}
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {notifications.length === 0 ? (
            <div>No notifications</div>
          ) : (
            notifications.map((notif, index) => (
              <div key={index} className="notification-item">
                <div className="notification-name">
                  {notif.name}
                </div>
                <div className="notification-date">
                  {format(new Date(notif.datetime), 'dd MMM yyyy HH:mm:ss')}
                </div>
              </div>
            ))
          )}
          {loading && <div>Loading...</div>}
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default NotificationPopover;
