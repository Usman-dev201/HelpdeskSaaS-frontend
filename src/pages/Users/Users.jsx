import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import "./Users.css";

function Users() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        role: 1
    });

    // ================================
    // LOAD USERS
    // ================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/Users");

            setUsers(response.data);
        } catch (err) {
            console.error("Users loading error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You do not have permission to access user management."
                );
                return;
            }

            setError("Unable to load users.");
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // PAGE LOAD
    // ================================

    useEffect(() => {
        loadUsers();
    }, []);

    // ================================
    // FORM CHANGE
    // ================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================================
    // OPEN CREATE MODAL
    // ================================

    const openCreateModal = () => {
        setEditingUser(null);

        setFormData({
            userName: "",
            email: "",
            password: "",
            role: 1
        });

        setFormError("");
        setShowModal(true);
    };

    // ================================
    // OPEN EDIT MODAL
    // ================================

    const openEditModal = (user) => {
        setEditingUser(user);

        setFormData({
            userName: user.userName,
            email: user.email,
            password: "",
            role:
                user.role?.toLowerCase() === "agent"
                    ? 2
                    : 1
        });

        setFormError("");
        setShowModal(true);
    };

    // ================================
    // CREATE / UPDATE USER
    // ================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError("");

        if (!formData.userName.trim()) {
            setFormError("User name is required.");
            return;
        }

        if (!formData.email.trim()) {
            setFormError("Email is required.");
            return;
        }

        if (!editingUser && !formData.password.trim()) {
            setFormError("Password is required.");
            return;
        }

        try {
            setFormLoading(true);

            if (editingUser) {
                await api.put(
                    `/Users/${editingUser.userId}`,
                    {
                        userName: formData.userName,
                        email: formData.email,
                        password: formData.password,
                        role: Number(formData.role)
                    }
                );
            } else {
                await api.post("/Users", {
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    role: Number(formData.role)
                });
            }

            setShowModal(false);

            await loadUsers();
        } catch (err) {
            console.error("User save error:", err);

            if (typeof err.response?.data === "string") {
                setFormError(err.response.data);
            } else {
                setFormError(
                    err.response?.data?.message ||
                    "Unable to save user."
                );
            }
        } finally {
            setFormLoading(false);
        }
    };

    // ================================
    // DELETE USER
    // ================================

    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.userName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/Users/${user.userId}`);

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (item) => item.userId !== user.userId
                )
            );
        } catch (err) {
            console.error("Delete user error:", err);

            alert(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message ||
                      "Unable to delete user."
            );
        }
    };

    // ================================
    // LOADING
    // ================================

    if (loading) {
        return (
            <div className="users-loading">
                <div className="loading-spinner"></div>
                <span>Loading users...</span>
            </div>
        );
    }

    return (
        <div className="users-layout">

            <Sidebar />

            <div className="users-main">

                <Topbar
                    title="User Management"
                    label="ADMINISTRATION"
                />

                <main className="users-content">

                    {/* HEADER */}

                    <div className="users-page-header">

                        <div>
                            <span className="section-label">
                                TEAM
                            </span>

                            <h1>User Management</h1>

                            <p>
                                Manage agents and customers in your tenant.
                            </p>
                        </div>

                        <button
                            className="add-user-button"
                            onClick={openCreateModal}
                        >
                            + Add User
                        </button>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="users-error">
                            {error}
                        </div>
                    )}

                    {/* USERS TABLE */}

                    <div className="users-card">

                        <div className="users-card-header">

                            <div>
                                <strong>Team Members</strong>
                                <span>
                                    {users.length} users
                                </span>
                            </div>

                        </div>

                        {users.length === 0 ? (
                            <div className="empty-users">
                                No users found.
                            </div>
                        ) : (
                            <div className="users-table-wrapper">

                                <table className="users-table">

                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Company</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.map((user) => (

                                            <tr key={user.userId}>

                                                <td>
                                                    <div className="user-cell">

                                                        <div className="user-avatar">
                                                            {user.userName
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <strong>
                                                            {user.userName}
                                                        </strong>

                                                    </div>
                                                </td>

                                                <td>
                                                    {user.email}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`role-badge ${
                                                            user.role
                                                                ?.toLowerCase()
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td>
                                                    {user.tenantName}
                                                </td>

                                                <td>

                                                    <div className="user-actions">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                openEditModal(user)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(user)
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>

                </main>

            </div>

            {/* ================================
                CREATE / EDIT MODAL
            ================================= */}

            {showModal && (

                <div
                    className="user-modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="user-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="user-modal-header">

                            <div>
                                <span className="section-label">
                                    {editingUser
                                        ? "EDIT USER"
                                        : "NEW USER"}
                                </span>

                                <h2>
                                    {editingUser
                                        ? "Edit User"
                                        : "Create User"}
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>

                        </div>

                        {formError && (
                            <div className="modal-error">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} autoComplete="off">

                            <div className="form-group">

                                <label>User Name</label>

                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Enter user name"
                                        autoComplete="off"

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
                                        autoComplete="off"

                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Password
                                    {editingUser && (
                                        <span className="optional">
                                            Optional
                                        </span>
                                    )}
                                </label>

                                <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder={
        editingUser
            ? "Leave blank to keep current password"
            : "Enter password"
    }
    autoComplete="new-password"
/>

                            </div>

                            <div className="form-group">

                                <label>Role</label>

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value={1}>
                                        Customer
                                    </option>

                                    <option value={2}>
                                        Agent
                                    </option>
                                </select>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-user-button"
                                    disabled={formLoading}
                                >
                                    {formLoading
                                        ? "Saving..."
                                        : editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Users;