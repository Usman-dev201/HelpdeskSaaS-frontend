import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../../services/api.jsx";

function Login() {
      const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
        setError("Email and password are required.");
        return;
    }

    try {
        setLoading(true);

        const response = await api.post(
            "/Auth/login",
            formData
        );

        console.log("Login response:", response.data);

        if (response.data?.token) {

            localStorage.setItem(
                "token",
                response.data.token
            );

            // Notify NotificationContext
            // that authentication has changed
            window.dispatchEvent(
                new Event("authChanged")
            );

            // Navigate according to role
            if (response.data.role === "Admin") {

                navigate("/dashboard");

            } else if (
                response.data.role === "Agent" ||
                response.data.role === "Customer"
            ) {

                navigate("/tickets");

            } else {

                setError("Invalid user role.");

            }

        } else {

            setError(
                "Login failed. Token not received."
            );

        }

    } catch (err) {

        console.error(
            "Login error:",
            err
        );

        if (err.response) {

            if (
                typeof err.response.data ===
                "string"
            ) {

                setError(
                    err.response.data
                );

            } else if (
                err.response.data?.message
            ) {

                setError(
                    err.response.data.message
                );

            } else {

                setError(
                    "Invalid email or password."
                );

            }

        } else {

            setError(
                "Unable to connect to the backend."
            );

        }

    } finally {

        setLoading(false);

    }
};
    return (
        <div className="login-page">

            <div className="login-ticket">

                {/* TOP TICKET HEADER */}
                <div className="login-ticket-header">

                    <div className="brand-area">
                        <div className="brand-mark">
                            H
                        </div>

                        <div>
                            <span className="brand-name">
                                HelpdeskSaaS
                            </span>

                            <span className="brand-label">
                                CUSTOMER SUPPORT PLATFORM
                            </span>
                        </div>
                    </div>

                    <div className="ticket-number">
                        <span>ACCESS</span>
                        <strong>LOGIN</strong>
                    </div>

                </div>


                {/* DECORATIVE TICKET LINE */}
                <div className="ticket-line">
                    <span></span>
                </div>


                {/* MAIN LOGIN CONTENT */}
                <div className="login-content">

                    <div className="login-intro">

                        <span className="section-label">
                            WELCOME BACK
                        </span>

                        <h1>
                            Sign in to your
                            <br />
                            workspace.
                        </h1>

                        <p>
                            Access your support workspace,
                            manage tickets and stay connected
                            with your team.
                        </p>

                    </div>


                    {/* LOGIN FORM */}
                    <div className="login-form-area">

                        {error && (
                            <div className="error-message">

                                <span className="message-icon">
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>
                        )}
{success && (
    <div className="success-message">
        <span className="success-icon">
            ✓
        </span>

        <span>
            {success}
        </span>
    </div>
)}
                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />

                            </div>


                            <div className="form-group">

                                <div className="password-label">
                                    <label htmlFor="password">
                                        Password
                                    </label>
                                </div>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />

                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="button-arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>


                        <div className="create-account">

                            <span>
                                Don't have an account?
                            </span>

                            <Link
                                to="/register"
                                className="register-link"
                            >
                                Create an account
                            </Link>

                        </div>

                    </div>

                </div>


                {/* BOTTOM TICKET SECTION */}
                <div className="login-ticket-footer">

                    <div className="footer-status">
                        <span className="status-dot"></span>
                        SECURE WORKSPACE ACCESS
                    </div>

                    <div className="footer-id">
                        HELPDESK / AUTH
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;