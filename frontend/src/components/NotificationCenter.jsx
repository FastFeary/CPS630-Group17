import '../css/NotificationCenter.css';

const NotificationCenter = ({ notifications, removeNotification, isConnected }) => {
    return (
        <div className="notificationCenter">
            <div className="notificationsContainer">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`notification notification${notification.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`}
                    >
                        <div className="notificationContent">
                            <p className="notificationText">{notification.message}</p>
                            {notification.timestamp && (
                                <span className="notificationTime">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                        <button
                            className="notificationClose"
                            onClick={() => removeNotification(notification.id)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationCenter;
