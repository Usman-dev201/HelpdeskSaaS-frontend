import { useState } from "react";
import "./Register.css";
import api from "../../services/api.jsx";


function Register() {
    const [formData, setFormData] = useState({
        tenantName: "",
        userName: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.tenantName ||
            !formData.userName ||
            !formData.email ||
            !formData.password
        ) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/Auth/register-tenant",
                formData
            );

            console.log(response.data);

            setMessage(
                "Registration successful! You can now login."
            );

            setFormData({
                tenantName: "",
                userName: "",
                email: "",
                password: ""
            });
        } catch (err) {
            console.error(err);

            if (err.response) {
                if (typeof err.response.data === "string") {
                    setError(err.response.data);
                } else if (err.response.data?.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Registration failed.");
                }
            } else {
                setError("Unable to connect to the backend.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="ticket-card">

                {/* Left: ticket panel */}
                <aside className="ticket-panel">
                    <div className="ticket-panel-inner">
                        <span className="ticket-badge">Ticket #0001</span>

                        <h1>
                            Open a helpdesk
                            <br />
                            for your team
                        </h1>

                        <p className="ticket-copy">
                            Every request, tracked from first message
                            to resolved ticket. Set up your workspace
                            in under a minute.
                        </p>
                    </div>
                </aside>

                {/* Middle: perforated tear-line */}
                <div className="perforation" aria-hidden="true" />

                {/* Right: form panel */}
                <div className="form-panel">
                    <div className="form-panel-inner">

                        <h2>Create your account</h2>
                        <p className="form-subtitle">
                            Set up your Helpdesk workspace
                        </p>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Company Name</label>

                                <input
                                    type="text"
                                    name="tenantName"
                                    value={formData.tenantName}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div className="form-group">
                                <label>User Name</label>

                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Register"}
                            </button>

                        </form>

                        <p className="login-hint">
                            Already have an account?{" "}
                            <a href="/login" className="login-link">
                                Login
                            </a>
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;