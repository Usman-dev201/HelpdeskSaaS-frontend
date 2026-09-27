import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    startNotificationConnection,
    stopNotificationConnection,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService";


const NotificationContext =
    createContext(null);


export const NotificationProvider = ({
    children
}) => {

    const [notifications, setNotifications] =
        useState([]);


    useEffect(() => {

        const handleAuthChanged = async () => {

            console.log(
                "🔄 Authentication changed. Restarting notification system..."
            );


            // Stop old SignalR connection
            await stopNotificationConnection();


            const token =
                localStorage.getItem("token");


            // No user logged in
            if (!token) {

                console.log(
                    "🔴 No token found. Notification system stopped."
                );

                setNotifications([]);

                return;
            }


            console.log(
                "🟢 Token found. Loading notifications..."
            );


            // Load unread notifications from DB
            const savedNotifications =
                await getNotifications();


            setNotifications(
                savedNotifications.map(
                    notification => ({
                        id:
                            notification.notificationId,

                        message:
                            notification.message,

                        createdAt:
                            notification.createdAt,

                        isRead:
                            notification.isRead,

                        isPersisted:
                            true
                    })
                )
            );


            // Handle real-time notification
            const handleNotification = (
                notification
            ) => {

                console.log(
                    "🔔 Context notification:",
                    notification
                );


                // Notification sound
                const audio = new Audio(
                    "/sounds/notification.wav"
                );

                audio.volume = 0.6;


                audio.play()
                    .then(() => {

                        console.log(
                            "🔊 Notification sound played."
                        );

                    })
                    .catch(error => {

                        console.error(
                            "❌ Notification sound could not play:",
                            error
                        );

                    });


                const newNotification = {

                    id:
                        notification.notificationId,

                    message:
                        notification.message,

                    createdAt:
                        notification.createdAt,

                    isRead:
                        notification.isRead,

                    isPersisted:
                        true
                };


                setNotifications(
                    current => {

                        // Prevent duplicate notification
                        const alreadyExists =
                            current.some(
                                item =>
                                    item.id ===
                                    newNotification.id
                            );


                        if (alreadyExists) {
                            return current;
                        }


                        return [
                            newNotification,
                            ...current
                        ];
                    }
                );
            };


            // Start SignalR for current user
            await startNotificationConnection(
                handleNotification
            );

        };


        // Listen for login/logout
        window.addEventListener(
            "authChanged",
            handleAuthChanged
        );


        // Initial load
        handleAuthChanged();


        return () => {

            window.removeEventListener(
                "authChanged",
                handleAuthChanged
            );

            stopNotificationConnection();

        };

    }, []);


    const unreadCount =
        notifications.filter(
            notification =>
                !notification.isRead
        ).length;


    const markAsRead = async (id) => {

        const success =
            await markNotificationAsRead(id);


        if (!success) {
            return;
        }


        setNotifications(
            current =>
                current.filter(
                    notification =>
                        notification.id !== id
                )
        );

    };


    const markAllAsRead = async () => {

        const success =
            await markAllNotificationsAsRead();


        if (!success) {
            return;
        }


        setNotifications([]);

    };


    const clearNotifications = () => {

        setNotifications([]);

    };


    return (

        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                clearNotifications
            }}
        >

            {children}

        </NotificationContext.Provider>

    );

};


export const useNotifications = () => {

    return useContext(
        NotificationContext
    );

};