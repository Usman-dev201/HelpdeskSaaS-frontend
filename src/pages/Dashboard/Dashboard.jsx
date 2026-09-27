import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import "./Dashboard.css";

function Dashboard() {
      const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0
    });

    const [priorityStats, setPriorityStats] = useState({
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
    });

    const [categoryStats, setCategoryStats] = useState([]);

    const [agentPerformance, setAgentPerformance] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                statsResponse,
                priorityResponse,
                categoryResponse,
                agentResponse
            ] = await Promise.all([
                api.get("/Dashboard/stats"),
                api.get("/Dashboard/priority-stats"),
                api.get("/Dashboard/category-stats"),
                api.get("/Dashboard/agent-performance")
            ]);

            setStats(statsResponse.data);
            setPriorityStats(priorityResponse.data);
            setCategoryStats(categoryResponse.data);
            setAgentPerformance(agentResponse.data);

        } catch (err) {
            console.error("Dashboard error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You do not have permission to access the dashboard."
                );
                return;
            }

            setError("Unable to load dashboard data.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

 
    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <span>Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
     <Sidebar />
         
            {/* ================= MAIN AREA ================= */}

            <div className="dashboard-main">


             <Topbar
        title="Helpdesk Dashboard"
        label="WORKSPACE"
    />  

  

                {/* ================= CONTENT ================= */}

                <main className="dashboard-content">
 


                    {/* PAGE HEADER */}

                    <div className="page-heading">

                        <div>

                            <span className="heading-label">
                                OVERVIEW
                            </span>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Monitor your support
                                workspace and team activity.
                            </p>

                        </div>


                        <button
                            className="refresh-button"
                            onClick={loadDashboard}
                        >
                            <span>
                                ↻
                            </span>

                            Refresh
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="dashboard-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}


                    {/* ================= STATS ================= */}

                    <section className="stats-grid">


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span>
                                    TOTAL TICKETS
                                </span>

                                <div className="stat-icon">
                                    #
                                </div>

                            </div>

                            <strong>
                                {stats.totalTickets}
                            </strong>

                            <small>
                                All support tickets
                            </small>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span>
                                    OPEN
                                </span>

                                <div className="stat-icon open">
                                    ○
                                </div>

                            </div>

                            <strong>
                                {stats.openTickets}
                            </strong>

                            <small>
                                Awaiting action
                            </small>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span>
                                    IN PROGRESS
                                </span>

                                <div className="stat-icon progress">
                                    ◌
                                </div>

                            </div>

                            <strong>
                                {stats.inProgressTickets}
                            </strong>

                            <small>
                                Currently being handled
                            </small>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span>
                                    RESOLVED
                                </span>

                                <div className="stat-icon resolved">
                                    ✓
                                </div>

                            </div>

                            <strong>
                                {stats.resolvedTickets}
                            </strong>

                            <small>
                                Successfully resolved
                            </small>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span>
                                    CLOSED
                                </span>

                                <div className="stat-icon closed">
                                    ■
                                </div>

                            </div>

                            <strong>
                                {stats.closedTickets}
                            </strong>

                            <small>
                                Completed tickets
                            </small>

                        </div>

                    </section>


                    {/* ================= ANALYTICS ================= */}

                    <section className="analytics-grid">


                        {/* PRIORITY */}

                        <div className="dashboard-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        TICKET ANALYTICS
                                    </span>

                                    <h2>
                                        Priority Overview
                                    </h2>

                                </div>

                                <div className="panel-mark">
                                    P
                                </div>

                            </div>


                            <div className="priority-list">


                                <div className="priority-row">

                                    <div className="priority-name">
                                        <span className="priority-dot low"></span>
                                        Low
                                    </div>

                                    <strong>
                                        {priorityStats.low}
                                    </strong>

                                </div>


                                <div className="priority-row">

                                    <div className="priority-name">
                                        <span className="priority-dot medium"></span>
                                        Medium
                                    </div>

                                    <strong>
                                        {priorityStats.medium}
                                    </strong>

                                </div>


                                <div className="priority-row">

                                    <div className="priority-name">
                                        <span className="priority-dot high"></span>
                                        High
                                    </div>

                                    <strong>
                                        {priorityStats.high}
                                    </strong>

                                </div>


                                <div className="priority-row">

                                    <div className="priority-name">
                                        <span className="priority-dot urgent"></span>
                                        Urgent
                                    </div>

                                    <strong>
                                        {priorityStats.urgent}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="dashboard-panel">

                            <div className="panel-heading">

                                <div>

                                    <span>
                                        TICKET ANALYTICS
                                    </span>

                                    <h2>
                                        Categories
                                    </h2>

                                </div>

                                <div className="panel-mark">
                                    C
                                </div>

                            </div>


                            <div className="category-list">

                                {categoryStats.length === 0 ? (

                                    <div className="empty-state">
                                        No categories available.
                                    </div>

                                ) : (

                                  categoryStats.slice(0, 5).map(
    (category) => (

                                            <div
                                                className="category-row"
                                                key={
                                                    category.category
                                                }
                                            >

                                                <span>
                                                    {
                                                        category.category
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        category.ticketCount
                                                    }
                                                </strong>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

    {categoryStats.length > 5 && (
        <button
            className="view-all-button"
            onClick={() =>
                navigate("/categories")
            }
        >
            View All Categories →
        </button>
    )}
                        </div>

                    </section>


                    {/* ================= AGENT PERFORMANCE ================= */}

                    <section className="dashboard-panel agent-panel">

                        <div className="panel-heading">

                            <div>

                                <span>
                                    TEAM MANAGEMENT
                                </span>

                                <h2>
                                    Agent Performance
                                </h2>

                            </div>

                            <div className="panel-mark">
                                A
                            </div>

                        </div>


                        {agentPerformance.length === 0 ? (

                            <div className="empty-state">
                                No agents available.
                            </div>

                        ) : (

                            <div className="agent-table">

                                <div className="agent-row agent-header">

                                    <div>
                                        AGENT
                                    </div>

                                    <div>
                                        ASSIGNED
                                    </div>

                                    <div>
                                        RESOLVED
                                    </div>

                                    <div>
                                        CLOSED
                                    </div>

                                </div>


                                {
                               agentPerformance.slice(0, 5).map(
    (agent) => (

                                        <div
                                            className="agent-row"
                                            key={
                                                agent.agentId
                                            }
                                        >

                                            <div className="agent-info">

                                                <div className="agent-avatar">
                                                    {agent.agentName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            agent.agentName
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            agent.email
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="agent-number">
                                                {
                                                    agent.assignedTickets
                                                }
                                            </div>


                                            <div className="agent-number resolved-number">
                                                {
                                                    agent.resolvedTickets
                                                }
                                            </div>


                                            <div className="agent-number">
                                                {
                                                    agent.closedTickets
                                                }
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}
{agentPerformance.length > 5 && (
    <button
        className="view-all-button"
        onClick={() =>
            navigate("/agents-performance")
        }
    >
        View All Agents →
    </button>
)}
                    </section>


                    {/* FOOTER */}

                    <footer className="dashboard-footer">

                        <span>
                            HELPDESK SAAS
                        </span>

                        <span>
                            SECURE WORKSPACE
                        </span>

                        <span>
                            ADMIN CONSOLE
                        </span>

                    </footer>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;