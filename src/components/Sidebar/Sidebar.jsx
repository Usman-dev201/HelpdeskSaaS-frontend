import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

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


                {/* NAVIGATION */}

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
                            navigate("/dashboard")
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
                            navigate("/tickets")
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
                            navigate("/users")
                        }
                    >

                        <span className="nav-icon">
                            ♙
                        </span>

                        <span>
                            Users
                        </span>

                    </button>


                    <span className="nav-title nav-title-second">
                        MANAGEMENT
                    </span>


                    {/* REPORTS */}

                    <button
                        className={`nav-item ${
                            isActive("/reports")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/reports")
                        }
                    >

                        <span className="nav-icon">
                            ◫
                        </span>

                        <span>
                            Reports
                        </span>

                    </button>

                </nav>

            </div>


            {/* ================= SIDEBAR BOTTOM ================= */}

            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <div className="user-avatar">
                        A
                    </div>

                    <div className="sidebar-user-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Administrator
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