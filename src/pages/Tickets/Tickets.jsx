import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Tickets.css";

function Tickets() {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showCreateModal, setShowCreateModal] =useState(false);
    const [createLoading, setCreateLoading] = useState(false);
 const [createError, setCreateError] = useState("");

    const [newTicket, setNewTicket] = useState({
        ticketTitle: "",
        description: "",
        priority: 2,
        category: ""
    });
const [showManageModal, setShowManageModal] = useState(false);

const [selectedTicket, setSelectedTicket] = useState(null);

const [selectedAgentId, setSelectedAgentId] = useState("");

const [selectedStatus, setSelectedStatus] = useState(1);

const [actionLoading, setActionLoading] = useState(false);

const [actionError, setActionError] = useState("");
const [agents, setAgents] = useState([]);
const [loadingAgents, setLoadingAgents] = useState(false);
const [currentRole, setCurrentRole] = useState("");
const [comments, setComments] = useState([]);
const [commentsLoading, setCommentsLoading] = useState(false);
const [commentMessage, setCommentMessage] = useState("");
const [commentLoading, setCommentLoading] = useState(false);
const [commentError, setCommentError] = useState("");
    /* =====================================================
       LOAD TICKETS
       ===================================================== */

    const loadTickets = async () => {

        try {

            setLoading(true);
            setError("");

          const response = await api.get(
    "/Tickets"
);

            setTickets(response.data);

        } catch (err) {

            console.error(
                "Tickets loading error:",
                err
            );

            if (err.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            if (err.response?.status === 403) {

                setError(
                    "You do not have permission to view tickets."
                );

                return;
            }

            setError(
                "Unable to load tickets."
            );

        } finally {

            setLoading(false);

        }
    };
/* =====================================================
   LOAD AGENTS
   ===================================================== */

const loadAgents = async () => {

    try {

        setLoadingAgents(true);

        const response = await api.get("/Users");

        const agentUsers = response.data.filter(
            (user) => user.role?.toLowerCase() === "agent"
        );

        setAgents(agentUsers);

    } catch (err) {

        console.error(
            "Agents loading error:",
            err
        );

        setActionError(
            "Unable to load agents."
        );

    } finally {

        setLoadingAgents(false);
    }
};
const getCurrentRole = () => {

    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return (
            payload[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] || payload.role
        );

    } catch (error) {

        console.error("Unable to read user role:", error);

        return null;
    }
};
const getCurrentUserId = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return Number(
            payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ] || payload.sub
        );
    } catch (error) {
        console.error(
            "Unable to read current user ID:",
            error
        );

        return null;
    }
};
const loadComments = async (ticketId) => {
    try {
        setCommentsLoading(true);
        setCommentError("");

        const response = await api.get(
            `/Tickets/${ticketId}/comments`
        );

        setComments(response.data);
    } catch (err) {
        console.error("Comments loading error:", err);

        if (typeof err.response?.data === "string") {
            setCommentError(err.response.data);
        } else {
            setCommentError(
                err.response?.data?.message ||
                "Unable to load comments."
            );
        }
    } finally {
        setCommentsLoading(false);
    }
};
const handleAddComment = async () => {
    if (!selectedTicket) {
        return;
    }

    if (!commentMessage.trim()) {
        setCommentError("Comment message is required.");
        return;
    }

    try {
        setCommentLoading(true);
        setCommentError("");

        await api.post(
            `/Tickets/${selectedTicket.ticketId}/comments`,
            {
                message: commentMessage.trim()
            }
        );

        setCommentMessage("");

        await loadComments(
            selectedTicket.ticketId
        );

    } catch (err) {
        console.error("Add comment error:", err);

        if (typeof err.response?.data === "string") {
            setCommentError(err.response.data);
        } else {
            setCommentError(
                err.response?.data?.message ||
                "Unable to add comment."
            );
        }
    } finally {
        setCommentLoading(false);
    }
};
const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await api.delete(
            `/Tickets/comments/${commentId}`
        );

        setComments((currentComments) =>
            currentComments.filter(
                (comment) =>
                    comment.commentId !== commentId
            )
        );

    } catch (err) {
        console.error(
            "Delete comment error:",
            err
        );

        alert(
            typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message ||
                  "Unable to delete comment."
        );
    }
};
    /* =====================================================
       LOAD ON PAGE OPEN
       ===================================================== */

   useEffect(() => {
    const role = getCurrentRole();

    if (role) {
        setCurrentRole(role);
    }

    loadTickets();
}, []);
    /* =====================================================
       SEARCH
       ===================================================== */

    const filteredTickets = tickets.filter((ticket) => {

        const searchText =
            search.toLowerCase().trim();

        if (!searchText) {
            return true;
        }

        return (
            ticket.ticketTitle
                ?.toLowerCase()
                .includes(searchText) ||

            ticket.category
                ?.toLowerCase()
                .includes(searchText) ||

            ticket.status
                ?.toLowerCase()
                .includes(searchText) ||

            ticket.priority
                ?.toLowerCase()
                .includes(searchText) ||
ticket.createdByUserName
    ?.toLowerCase()
    .includes(searchText) ||

ticket.assignedAgentName
    ?.toLowerCase()
    .includes(searchText)
        );
    });


    /* =====================================================
       CREATE TICKET INPUT
       ===================================================== */

    const handleCreateChange = (e) => {

        setNewTicket({
            ...newTicket,
            [e.target.name]: e.target.value
        });

    };


    /* =====================================================
       CREATE TICKET
       ===================================================== */

    const handleCreateTicket = async (e) => {

        e.preventDefault();

        setCreateError("");

        if (
            !newTicket.ticketTitle.trim() ||
            !newTicket.description.trim() ||
            !newTicket.category.trim()
        ) {

            setCreateError(
                "Title, description and category are required."
            );

            return;
        }

        try {

            setCreateLoading(true);

            await api.post(
                "/Tickets",
                {
                    ticketTitle:
                        newTicket.ticketTitle,

                    description:
                        newTicket.description,

                    priority:
                        Number(newTicket.priority),

                    category:
                        newTicket.category
                }
            );

            setNewTicket({
                ticketTitle: "",
                description: "",
                priority: 2,
                category: ""
            });

            setShowCreateModal(false);

            await loadTickets();

        } catch (err) {

            console.error(
                "Create ticket error:",
                err
            );

            if (err.response?.data) {

                if (
                    typeof err.response.data ===
                    "string"
                ) {

                    setCreateError(
                        err.response.data
                    );

                } else {

                    setCreateError(
                        err.response.data.message ||
                        "Unable to create ticket."
                    );
                }

            } else {

                setCreateError(
                    "Unable to connect to backend."
                );

            }

        } finally {

            setCreateLoading(false);

        }
    };


    /* =====================================================
       DELETE TICKET
       ===================================================== */

    const handleDeleteTicket = async (ticketId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this ticket?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/Tickets/admin/${ticketId}`
            );

            setTickets((currentTickets) =>
                currentTickets.filter(
                    (ticket) =>
                        ticket.ticketId !== ticketId
                )
            );

        } catch (err) {

            console.error(
                "Delete ticket error:",
                err
            );

            alert(
                err.response?.data ||
                "Unable to delete ticket."
            );

        }
    };


 /* =====================================================
   ASSIGN TICKET
   ===================================================== */

const handleAssignTicket = async () => {

    if (!selectedTicket) {
        return;
    }

    if (!selectedAgentId) {
        setActionError("Please select an agent.");
        return;
    }

    try {

        setActionLoading(true);
        setActionError("");

        await api.put(
            `/Tickets/${selectedTicket.ticketId}/assign`,
            {
                agentId: Number(selectedAgentId)
            }
        );

        setSelectedAgentId("");

        setShowManageModal(false);

        await loadTickets();

    } catch (err) {

        console.error(
            "Assign ticket error:",
            err
        );

        if (typeof err.response?.data === "string") {

            setActionError(
                err.response.data
            );

        } else {

            setActionError(
                err.response?.data?.message ||
                "Unable to assign ticket."
            );
        }

    } finally {

        setActionLoading(false);
    }
};
/* =====================================================
   UNASSIGN TICKET
   ===================================================== */

const handleUnassignTicket = async () => {

    if (!selectedTicket) {
        return;
    }

    try {

        setActionLoading(true);
        setActionError("");

        await api.put(
            `/Tickets/${selectedTicket.ticketId}/unassign`
        );

        setShowManageModal(false);

        await loadTickets();

    } catch (err) {

        console.error(
            "Unassign ticket error:",
            err
        );

        if (typeof err.response?.data === "string") {

            setActionError(
                err.response.data
            );

        } else {

            setActionError(
                err.response?.data?.message ||
                "Unable to unassign ticket."
            );
        }

    } finally {

        setActionLoading(false);

    }
};

/* =====================================================
   UPDATE TICKET STATUS
   ===================================================== */

const handleUpdateStatus = async () => {

    if (!selectedTicket) {
        return;
    }

    try {

        setActionLoading(true);
        setActionError("");

        await api.put(
            `/Tickets/${selectedTicket.ticketId}/status`,
            {
                status: Number(selectedStatus)
            }
        );

        setShowManageModal(false);

        await loadTickets();

    } catch (err) {

        console.error(
            "Update status error:",
            err
        );

        if (typeof err.response?.data === "string") {

            setActionError(
                err.response.data
            );

        } else {

            setActionError(
                err.response?.data?.message ||
                "Unable to update ticket status."
            );
        }

    } finally {

        setActionLoading(false);

    }
};

const openManageModal = async (ticket) => {

    setSelectedTicket(ticket);

    setSelectedAgentId(
        ticket.assignedAgentId
            ? String(ticket.assignedAgentId)
            : ""
    );

    const statusMap = {
        open: 1,
        inprogress: 2,
        "in progress": 2,
        resolved: 3,
        closed: 4
    };

    setSelectedStatus(
        statusMap[
            ticket.status?.toLowerCase()
        ] || 1
    );

  setActionError("");
  setComments([]);
setCommentMessage("");
setCommentError("");

await loadComments(ticket.ticketId);

if (currentRole === "Admin") {
    await loadAgents();
}

setShowManageModal(true);
};
    /* =====================================================
       STATUS CLASS
       ===================================================== */

    const getStatusClass = (status) => {

        switch (status?.toLowerCase()) {

            case "open":
                return "status-open";

            case "inprogress":
            case "in progress":
                return "status-progress";

            case "resolved":
                return "status-resolved";

            case "closed":
                return "status-closed";

            default:
                return "";

        }
    };


    /* =====================================================
       PRIORITY CLASS
       ===================================================== */

    const getPriorityClass = (priority) => {

        switch (priority?.toLowerCase()) {

            case "low":
                return "priority-low";

            case "medium":
                return "priority-medium";

            case "high":
                return "priority-high";

            case "urgent":
                return "priority-urgent";

            default:
                return "";

        }
    };


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (
            <div className="tickets-loading">

                <div className="loading-spinner"></div>

                <span>
                    Loading tickets...
                </span>

            </div>
        );
    }


    return (

        <div className="tickets-layout">

     <Sidebar />
         
            {/* =================================================
                MAIN
               ================================================= */}

            <div className="tickets-main">

  <Topbar
    title="Ticket Management"
    label="WORKSPACE"
/>

                {/* CONTENT */}

                <main className="tickets-content">
                  

                    {/* PAGE HEADER */}

                    <div className="tickets-heading">

                        <div>

                            <span className="heading-label">
                                SUPPORT
                            </span>

                            <h1>
                                Tickets
                            </h1>

                            <p>
                                Manage and monitor customer
                                support tickets.
                            </p>

                        </div>


                        <button
                            className="create-ticket-button"
                            onClick={() => {

                                setCreateError("");

                                setShowCreateModal(
                                    true
                                );

                            }}
                        >
                            <span>
                                +
                            </span>

                            Create Ticket
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="tickets-error">

                            <span>
                                !
                            </span>

                            {error}

                        </div>

                    )}


                    {/* TOOLBAR */}

                    <div className="tickets-toolbar">

                        <div className="ticket-count">

                            <strong>
                                {filteredTickets.length}
                            </strong>

                            <span>
                                tickets
                            </span>

                        </div>


                        <div className="search-box">

                            <span>
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            className="refresh-tickets"
                            onClick={loadTickets}
                        >
                            ↻
                        </button>

                    </div>


                    {/* TICKET TABLE */}

                    <div className="ticket-table-card">

                        {filteredTickets.length === 0 ? (

                            <div className="empty-tickets">

                                <div className="empty-icon">
                                    □
                                </div>

                                <h3>
                                    No tickets found
                                </h3>

                                <p>
                                    There are no tickets
                                    matching your search.
                                </p>

                            </div>

                        ) : (

                            <div className="ticket-table">

                                {/* HEADER */}

                                <div className="ticket-row ticket-header">

                                    <div>
                                        TICKET
                                    </div>

                                    <div>
                                        CUSTOMER
                                    </div>

                                    <div>
                                        PRIORITY
                                    </div>

                                    <div>
                                        STATUS
                                    </div>

                                    <div>
                                        AGENT
                                    </div>

                                    <div>
                                        ACTION
                                    </div>

                                </div>


                                {/* ROWS */}

                                {filteredTickets.map(
                                    (ticket) => (

                                        <div
                                            className="ticket-row"
                                            key={
                                                ticket.ticketId
                                            }
                                        >

                                            {/* TICKET */}

                                            <div className="ticket-info">

                                                <strong>
                                                    {
                                                        ticket.ticketTitle
                                                    }
                                                </strong>

                                                <span>
                                                    #
                                                    {
                                                        ticket.ticketId
                                                    }

                                                    {" · "}

                                                    {
                                                        ticket.category
                                                    }
                                                </span>

                                            </div>


                                            {/* CUSTOMER */}

                                           <div className="customer-info">

    <strong>
        {
            ticket.createdByUserName ||
            "Unknown"
        }
    </strong>

    <span>
        User ID: {ticket.createdByUserId}
    </span>

</div>


                                            {/* PRIORITY */}

                                            <div>

                                                <span
                                                    className={
                                                        `priority-badge ${
                                                            getPriorityClass(
                                                                ticket.priority
                                                            )
                                                        }`
                                                    }
                                                >
                                                    {
                                                        ticket.priority
                                                    }
                                                </span>

                                            </div>


                                            {/* STATUS */}

                                            <div>

                                                <span
                                                    className={
                                                        `status-badge ${
                                                            getStatusClass(
                                                                ticket.status
                                                            )
                                                        }`
                                                    }
                                                >
                                                    {
                                                        ticket.status
                                                    }
                                                </span>

                                            </div>


                                            {/* AGENT */}

                                            <div className="agent-cell">

                                       {ticket.assignedAgentId ? (

    <>

        <div className="mini-avatar">
            {
                ticket.assignedAgentName
                    ?.charAt(0)
                    ?.toUpperCase()
            }
        </div>

        <span>
            {ticket.assignedAgentName}
        </span>

    </>

) : (

    <span className="unassigned">
        Unassigned
    </span>

)}

                                            </div>


                                            {/* ACTION */}

                                         <div className="ticket-action">

    <button
        className="manage-ticket-button"
        onClick={() =>
            openManageModal(ticket)
        }
        title="Manage ticket"
    >
        Manage
    </button>

    <button
        className="delete-ticket-button"
        onClick={() =>
            handleDeleteTicket(
                ticket.ticketId
            )
        }
        title="Delete ticket"
    >
        ×
    </button>

</div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </main>

            </div>


            {/* =================================================
                CREATE TICKET MODAL
               ================================================= */}

            {showCreateModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowCreateModal(false)
                    }
                >

                    <div
                        className="create-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <span>
                                    NEW SUPPORT REQUEST
                                </span>

                                <h2>
                                    Create Ticket
                                </h2>

                            </div>

                            <button
                                onClick={() =>
                                    setShowCreateModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>


                        {createError && (

                            <div className="modal-error">
                                {createError}
                            </div>

                        )}


                        <form
                            onSubmit={
                                handleCreateTicket
                            }
                        >

                            <div className="modal-form-group">

                                <label>
                                    Ticket Title
                                </label>

                                <input
                                    type="text"
                                    name="ticketTitle"
                                    value={
                                        newTicket.ticketTitle
                                    }
                                    onChange={
                                        handleCreateChange
                                    }
                                    placeholder="Enter ticket title"
                                />

                            </div>


                            <div className="modal-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        newTicket.description
                                    }
                                    onChange={
                                        handleCreateChange
                                    }
                                    placeholder="Describe the issue..."
                                    rows="5"
                                />

                            </div>


                            <div className="modal-two-columns">

                                <div className="modal-form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            newTicket.priority
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                    >

                                        <option value="1">
                                            Low
                                        </option>

                                        <option value="2">
                                            Medium
                                        </option>

                                        <option value="3">
                                            High
                                        </option>

                                        <option value="4">
                                            Urgent
                                        </option>

                                    </select>

                                </div>


                                <div className="modal-form-group">

                                    <label>
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={
                                            newTicket.category
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        placeholder="e.g. Technical"
                                    />

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowCreateModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="submit-ticket-button"
                                    disabled={
                                        createLoading
                                    }
                                >

                                    {createLoading
                                        ? "Creating..."
                                        : "Create Ticket"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}
            {/* =================================================
    MANAGE TICKET MODAL
   ================================================= */}

{showManageModal && selectedTicket && (

    <div
        className="modal-overlay"
        onClick={() =>
            setShowManageModal(false)
        }
    >

        <div
            className="manage-modal"
            onClick={(e) =>
                e.stopPropagation()
            }
        >

            {/* HEADER */}

            <div className="modal-header">

                <div>

                    <span>
                        TICKET MANAGEMENT
                    </span>

                    <h2>
                        Manage Ticket
                    </h2>

                </div>

                <button
                    onClick={() =>
                        setShowManageModal(false)
                    }
                >
                    ×
                </button>

            </div>


            {/* TICKET INFO */}

            <div className="manage-ticket-info">

                <strong>
                    {selectedTicket.ticketTitle}
                </strong>

                <span>
                    Ticket #{selectedTicket.ticketId}
                </span>

            </div>


            {/* ERROR */}

            {actionError && (

                <div className="modal-error">
                    {actionError}
                </div>

            )}


           {currentRole === "Admin" && (
    <>
        {/* ASSIGN */}

        <div className="modal-form-group">

            <label>
                Assign Agent
            </label>

            <select
                value={selectedAgentId}
                onChange={(e) =>
                    setSelectedAgentId(e.target.value)
                }
                disabled={loadingAgents}
            >

                <option value="">
                    {loadingAgents
                        ? "Loading agents..."
                        : "Select an agent"}
                </option>

                {agents.map((agent) => (
                    <option
                        key={agent.userId}
                        value={agent.userId}
                    >
                        {agent.userName} — {agent.email}
                    </option>
                ))}

            </select>

            {!loadingAgents && agents.length === 0 && (
                <small>
                    No agents are available in your tenant.
                </small>
            )}

        </div>


        {/* ASSIGN / UNASSIGN */}

        <div className="manage-actions">

            <button
                className="submit-ticket-button"
                onClick={handleAssignTicket}
                disabled={actionLoading}
            >
                {actionLoading
                    ? "Processing..."
                    : "Assign Agent"}
            </button>

            <button
                className="unassign-button"
                onClick={handleUnassignTicket}
                disabled={
                    actionLoading ||
                    !selectedTicket.assignedAgentId
                }
            >
                Unassign
            </button>

        </div>
    </>
)}


            {/* STATUS */}

            <div className="modal-form-group">

                <label>
                    Ticket Status
                </label>

                <select
                    value={selectedStatus}
                    onChange={(e) =>
                        setSelectedStatus(
                            Number(e.target.value)
                        )
                    }
                >

                    <option value={1}>
                        Open
                    </option>

                    <option value={2}>
                        In Progress
                    </option>

                    <option value={3}>
                        Resolved
                    </option>

                    <option value={4}>
                        Closed
                    </option>

                </select>

            </div>


            <button
                className="update-status-button"
                onClick={handleUpdateStatus}
                disabled={actionLoading}
            >
                {actionLoading
                    ? "Updating..."
                    : "Update Status"}
            </button>


            {/* CANCEL */}

            <div className="modal-actions">

                <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                        setShowManageModal(false)
                    }
                >
                    Cancel
                </button>

            </div>
            {/* COMMENTS */}

            <div className="comments-section">

                <div className="comments-header">

                    <div>
                        <span className="section-label">
                            CONVERSATION
                        </span>

                        <h3>Comments</h3>
                    </div>

                    <span className="comment-count">
                        {comments.length}
                    </span>

                </div>

                {commentError && (
                    <div className="comment-error">
                        {commentError}
                    </div>
                )}

                <div className="comments-list">

                    {commentsLoading ? (

                        <div className="comments-loading">
                            Loading comments...
                        </div>

                    ) : comments.length === 0 ? (

                        <div className="no-comments">
                            No comments yet.
                        </div>

                    ) : (

                        comments.map((comment) => {

                            const currentUserId =
                                getCurrentUserId();

                            const canDelete =
                                currentRole === "Admin" ||
                                Number(comment.userId) ===
                                currentUserId;

                            return (
                                <div
                                    className="comment-item"
                                    key={comment.commentId}
                                >

                                    <div className="comment-avatar">
                                        {comment.userName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div className="comment-body">

                                        <div className="comment-top">

                                            <div className="comment-user">

                                                <strong>
                                                    {comment.userName}
                                                </strong>

                                                <span className="comment-role">
                                                    {comment.role}
                                                </span>

                                            </div>

                                            <span className="comment-time">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleString()}
                                            </span>

                                        </div>

                                        <p>
                                            {comment.message}
                                        </p>

                                        {canDelete && (
                                            <button
                                                className="delete-comment-button"
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment.commentId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}

                                    </div>

                                </div>
                            );
                        })

                    )}

                </div>

                {/* ADD COMMENT */}

                <div className="add-comment">

                    <textarea
                        value={commentMessage}
                        onChange={(e) =>
                            setCommentMessage(e.target.value)
                        }
                        placeholder="Write a comment..."
                        rows="3"
                    />

                    <div className="add-comment-footer">

                        <span>
                            {commentMessage.length} characters
                        </span>

                        <button
                            onClick={handleAddComment}
                            disabled={
                                commentLoading ||
                                !commentMessage.trim()
                            }
                        >
                            {commentLoading
                                ? "Sending..."
                                : "Add Comment"}
                        </button>

                    </div>

                </div>

            </div>
        </div>


    </div>

)}

        </div>
    );
}

export default Tickets;