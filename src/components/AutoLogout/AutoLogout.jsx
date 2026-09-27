import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AutoLogout() {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        // Login page par timer nahi chalega
        if (location.pathname === "/login") {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        // 15 minutes
        const INACTIVITY_LIMIT = 15 * 60 * 1000;

        let inactivityTimer;

        const logoutUser = () => {

            localStorage.removeItem("token");

            navigate("/login", {
                replace: true
            });
        };

        const resetTimer = () => {

            clearTimeout(inactivityTimer);

            inactivityTimer = setTimeout(
                logoutUser,
                INACTIVITY_LIMIT
            );
        };

        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "click"
        ];

        activityEvents.forEach((event) => {

            window.addEventListener(
                event,
                resetTimer
            );

        });

        resetTimer();

        return () => {

            clearTimeout(inactivityTimer);

            activityEvents.forEach((event) => {

                window.removeEventListener(
                    event,
                    resetTimer
                );

            });

        };

    }, [navigate, location.pathname]);

    return null;
}

export default AutoLogout;