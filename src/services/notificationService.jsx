import {
    HubConnectionBuilder,
    LogLevel
} from "@microsoft/signalr";

let connection = null;



export const startNotificationConnection = async (
    onNotification
) => {

    const token = localStorage.getItem("token");

    if (!token) {

        console.log(
            "SignalR: No token found."
        );

        return;
    }


    if (
        connection &&
        connection.state === "Connected"
    ) {

        console.log(
            "SignalR: Already connected."
        );

        return;
    }


    connection = new HubConnectionBuilder()
        .withUrl(
            "https://localhost:7077/notificationHub",
            {
                accessTokenFactory: () =>
                    localStorage.getItem("token") || ""
            }
        )
        .withAutomaticReconnect()
        .configureLogging(
            LogLevel.Information
        )
        .build();


    connection.on(
        "ReceiveNotification",
        (message) => {

            console.log(
                "🔔 Notification received:",
                message
            );

            if (onNotification) {

                onNotification(message);

            }
        }
    );


    connection.onreconnecting((error) => {

        console.log(
            "SignalR reconnecting...",
            error
        );

    });


    connection.onreconnected((connectionId) => {

        console.log(
            "SignalR reconnected:",
            connectionId
        );

    });


    connection.onclose((error) => {

        console.log(
            "SignalR connection closed.",
            error
        );

    });


    try {

        await connection.start();

        console.log(
            "✅ SignalR notification connection started."
        );

    } catch (error) {

        console.error(
            "❌ SignalR connection error:",
            error
        );

        connection = null;
    }
};




export const getNotifications = async () => {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return [];

    }


    try {

        const response = await fetch(
            "https://localhost:7077/api/notifications",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch notifications."
            );

        }


        const data =
            await response.json();

        return data;

    } catch (error) {

        console.error(
            "❌ Notification fetch error:",
            error
        );

        return [];

    }
};




export const stopNotificationConnection =
    async () => {

        if (!connection) {

            return;

        }


        try {

            await connection.stop();

            console.log(
                "SignalR notification connection stopped."
            );

        } catch (error) {

            console.error(
                "SignalR disconnect error:",
                error
            );

        }


        connection = null;
    };



export const markNotificationAsRead = async (
    notificationId
) => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return false;
    }


    try {

        const response = await fetch(
            `https://localhost:7077/api/notifications/${notificationId}/read`,
            {
                method: "PUT",

                headers: {
                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to mark notification as read."
            );

        }


        console.log(
            "✅ Notification marked as read."
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Mark notification as read error:",
            error
        );

        return false;
    }
};



export const markAllNotificationsAsRead =
    async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return false;
        }


        try {

            const response = await fetch(
                "https://localhost:7077/api/notifications/read-all",
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to mark all notifications as read."
                );

            }


            console.log(
                "✅ All notifications marked as read."
            );

            return true;

        } catch (error) {

            console.error(
                "❌ Mark all notifications as read error:",
                error
            );

            return false;
        }
    };