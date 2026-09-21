import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar({
    title = "Helpdesk Dashboard",
    label = "WORKSPACE"
}) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (

        <header className="topbar">

            {/* ================= LEFT ================= */}

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


            {/* ================= RIGHT ================= */}

            <div className="topbar-right">

                <button
                    className="notification-button"
                    title="Notifications"
                >
                    ♢

                    <span className="notification-dot">
                    </span>

                </button>


                <div className="topbar-divider">
                </div>


                <div className="topbar-user">

                    <div className="topbar-avatar">
                        A
                    </div>

                    <div className="topbar-user-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;