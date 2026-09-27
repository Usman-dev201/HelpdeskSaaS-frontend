import {
    useState
} from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    useNotifications
} from "../../context/NotificationContext";

import {
    stopNotificationConnection
} from "../../services/notificationService";

import "./Sidebar.css";


function Sidebar() {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        clearNotifications
    } = useNotifications();
const [showPermissionPopup, setShowPermissionPopup] =
    useState(false);

    // ================= GET CURRENT USER =================

    const getCurrentUser = () => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            return {
                userName: "User",
                role: "User"
            };

        }


        try {

            const payload =
                JSON.parse(
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


    const currentUser =
        getCurrentUser();


    // ================= ROLE LABEL =================

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


    // ================= USER INITIAL =================

    const getInitial = (name) => {

        return (
            name
                ?.charAt(0)
                ?.toUpperCase() || "U"
        );

    };


    // ================= ACCESS CONTROL =================

   const handleNavigation = (path) => {

    if (
        (
            path === "/dashboard" ||
            path === "/users" ||
            path === "/reports"
        ) &&
        currentUser.role !== "Admin"
    ) {

        setShowPermissionPopup(true);

        return;
    }

    navigate(path);
};


    // ================= LOGOUT =================

    const handleLogout = async () => {

        await stopNotificationConnection();


        clearNotifications();


        localStorage.removeItem(
            "token"
        );


        window.dispatchEvent(
            new Event("authChanged")
        );


        navigate("/login");

    };


    // ================= ACTIVE NAVIGATION =================

    const isActive = (path) => {

        return location.pathname === path;

    };


    return (

        <aside className="sidebar">

            {/* ================= SIDEBAR TOP ================= */}

            <div className="sidebar-top">

                {/* BRAND */}

                <div className="sidebar-brand">

                    <div className="sidebar-logo">
                        H
                    </div>


                    <div className="sidebar-brand-text">

                        <strong>
                            HelpdeskSaaS
                        </strong>

                        <span>
                            SUPPORT PLATFORM
                        </span>

                    </div>

                </div>


                <div className="sidebar-divider"></div>


                {/* ================= NAVIGATION ================= */}

                <nav className="sidebar-nav">

                    <span className="nav-title">
                        WORKSPACE
                    </span>


                    {/* DASHBOARD */}

                    <button
                        className={`nav-item ${
                            isActive("/dashboard")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/dashboard"
                            )
                        }
                    >

                        <span className="nav-icon">
                            ▦
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* TICKETS */}

                    <button
                        className={`nav-item ${
                            isActive("/tickets")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/tickets"
                            )
                        }
                    >

                        <span className="nav-icon">
                            □
                        </span>

                        <span>
                            Tickets
                        </span>

                    </button>


                    {/* USERS */}

                    <button
                        className={`nav-item ${
                            isActive("/users")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/users"
                            )
                        }
                    >

                        <span className="nav-icon">
                            ♙
                        </span>

                        <span>
                            Users
                        </span>

                    </button>

{/* 
                    <span className="nav-title nav-title-second">
                        MANAGEMENT
                    </span>


                 
                    <button
                        className={`nav-item ${
                            isActive("/reports")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            handleNavigation(
                                "/reports"
                            )
                        }
                    >

                        <span className="nav-icon">
                            ◫
                        </span>

                        <span>
                            Reports
                        </span>

                    </button>
 */}
                </nav>

            </div>
{showPermissionPopup && (

    <div className="permission-overlay">

        <div className="permission-popup">

            <div className="permission-icon">
                !
            </div>

            <h3>
                Access Denied
            </h3>

            <p>
                You don't have permission
                to access this page.
            </p>

            <button
                onClick={() =>
                    setShowPermissionPopup(false)
                }
            >
                OK
            </button>

        </div>

    </div>

)}

            {/* ================= SIDEBAR BOTTOM ================= */}

            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <div className="user-avatar">

                        {getInitial(
                            currentUser.userName
                        )}

                    </div>


                    <div className="sidebar-user-info">

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


                {/* LOGOUT */}

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    <span>
                        ↪
                    </span>

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;