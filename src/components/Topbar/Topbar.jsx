import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import "./Topbar.css";

function Topbar({
    title = "Helpdesk Dashboard",
    label = "WORKSPACE"
}) {

    const navigate = useNavigate();

    //  NOTIFICATIONS 

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
         clearNotifications
    } = useNotifications();

    const [showNotifications, setShowNotifications] =
        useState(false);


    //CURRENT USER 

    const getCurrentUser = () => {

        const token = localStorage.getItem("token");

        if (!token) {
            return {
                userName: "User",
                role: "User"
            };
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const userName =
                payload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ] ||
                payload.name ||
                "User";

            const role =
                payload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] ||
                payload.role ||
                "User";

            return {
                userName,
                role
            };

        } catch (error) {

            console.error(
                "Unable to read user information:",
                error
            );

            return {
                userName: "User",
                role: "User"
            };
        }
    };


    const currentUser = getCurrentUser();


    // ROLE LABEL

    const getRoleLabel = (role) => {

        switch (role) {

            case "Admin":
                return "Administrator";

            case "Agent":
                return "Support Agent";

            case "Customer":
                return "Customer";

            default:
                return role;
        }
    };


    //USER INITIAL

    const getInitial = (name) => {

        return (
            name
                ?.charAt(0)
                ?.toUpperCase() || "U"
        );
    };


  

    // NOTIFICATION CLICK

    const handleNotificationClick = (
        notification
    ) => {

        markAsRead(notification.id);

    };


    return (

        <header className="topbar">

          

            <div className="topbar-left">

                <div className="mobile-menu">
                    ☰
                </div>

                <div>

                    <span className="topbar-label">
                        {label}
                    </span>

                    <strong>
                        {title}
                    </strong>

                </div>

            </div>



            <div className="topbar-right">

             

               <div
    className="notification-wrapper"
    onMouseEnter={() =>
        setShowNotifications(true)
    }
    onMouseLeave={() =>
        setShowNotifications(false)
    }
>

    <button
        className="notification-button"
        title="Notifications"
    >

                        ♢

                        {unreadCount > 0 && (
                            <span className="notification-dot">
                            </span>
                        )}

                    </button>



                    {showNotifications && (

                        <div className="notification-panel">

                            <div className="notification-header">

                                <strong>
                                    Notifications
                                </strong>

                                {unreadCount > 0 && (

                                    <button
                                        onClick={
                                            markAllAsRead
                                        }
                                    >
                                        Mark all as read
                                    </button>

                                )}

                            </div>


                            {notifications.length === 0 ? (

                                <div className="no-notifications">
                                    No notifications
                                </div>

                            ) : (

                                <div className="notification-list">

                                    {notifications.map(
                                        notification => (

                                            <div
                                                key={
                                                    notification.id
                                                }
                                                className={`notification-item ${
                                                    notification.isRead
                                                        ? "read"
                                                        : "unread"
                                                }`}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification
                                                    )
                                                }
                                            >

                                                <div className="notification-message">

                                                    {notification.message}

                                                </div>

                                                <small>

                                                    {notification.createdAt
                                                        ? new Date(
                                                            notification.createdAt
                                                        ).toLocaleTimeString()
                                                        : ""}

                                                </small>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )}

                </div>


                <div className="topbar-divider">
                </div>


             

                <div className="topbar-user">

                    <div className="topbar-avatar">

                        {getInitial(
                            currentUser.userName
                        )}

                    </div>

                    <div className="topbar-user-info">

                        <strong>
                            {currentUser.userName}
                        </strong>

                        <span>
                            {getRoleLabel(
                                currentUser.role
                            )}
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;