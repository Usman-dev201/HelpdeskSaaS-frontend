import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

import "./AgentsPerformance.css";


function AgentsPerformance() {

    const navigate = useNavigate();


    const [agents, setAgents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // PAGINATION
    // =========================

    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(5);


    // =========================
    // LOAD AGENT PERFORMANCE
    // =========================

    const loadAgentPerformance = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/Dashboard/agent-performance"
            );

            setAgents(response.data);

        } catch (err) {

            console.error(
                "Agent performance report error:",
                err
            );


            if (err.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            if (err.response?.status === 403) {

                setError(
                    "You do not have permission to view this report."
                );

                return;
            }


            setError(
                "Unable to load agent performance report."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadAgentPerformance();

    }, []);


    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
        agents.length / itemsPerPage
    );


    const startIndex =
        (currentPage - 1) * itemsPerPage;


    const endIndex =
        startIndex + itemsPerPage;


    const currentAgents =
        agents.slice(
            startIndex,
            endIndex
        );


    // =========================
    // CHANGE ITEMS PER PAGE
    // =========================

    const handleItemsPerPageChange = (e) => {

        setItemsPerPage(
            Number(e.target.value)
        );

        setCurrentPage(1);
    };


    // =========================
    // PREVIOUS PAGE
    // =========================

    const handlePrevious = () => {

        if (currentPage > 1) {

            setCurrentPage(
                currentPage - 1
            );
        }
    };


    // =========================
    // NEXT PAGE
    // =========================

    const handleNext = () => {

        if (currentPage < totalPages) {

            setCurrentPage(
                currentPage + 1
            );
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="agents-performance-loading">

                <div className="loading-spinner"></div>

                <span>
                    Loading agent performance...
                </span>

            </div>
        );
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="agents-performance-layout">


            <Sidebar />


            <div className="agents-performance-main">


                <Topbar
                    title="Agent Performance"
                    label="REPORTS"
                />


                <main className="agents-performance-content">


                    {/* =========================
                        PAGE HEADER
                    ========================= */}

                    <div className="agents-performance-heading">


                        <div>

                            <span className="heading-label">
                                TEAM ANALYTICS
                            </span>

                            <h1>
                                Agent Performance
                            </h1>

                            <p>
                                Monitor ticket activity
                                and performance across
                                your support agents.
                            </p>

                        </div>


                        <button
                            className="back-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Dashboard
                        </button>


                    </div>


                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (

                        <div className="agents-performance-error">

                            <span>!</span>

                            {error}

                        </div>
                    )}


                    {/* =========================
                        REPORT CARD
                    ========================= */}

                    <section className="agent-report-card">


                        {/* CARD HEADER */}

                        <div className="report-card-header">


                            <div>

                                <span className="section-label">
                                    TEAM MANAGEMENT
                                </span>

                                <h2>
                                    Agent Performance Report
                                </h2>

                            </div>


                            <div className="total-agents">

                                <span>
                                    TOTAL AGENTS
                                </span>

                                <strong>
                                    {agents.length}
                                </strong>

                            </div>


                        </div>


                        {/* =========================
                            TABLE
                        ========================= */}

                        {agents.length === 0 ? (

                            <div className="empty-state">

                                No agents available.

                            </div>

                        ) : (

                            <>


                                <div className="agent-table-wrapper">


                                    <table className="agent-performance-table">


                                        <thead>

                                            <tr>

                                                <th>
                                                    #
                                                </th>

                                                <th>
                                                    AGENT
                                                </th>

                                                <th>
                                                    ASSIGNED
                                                </th>

                                                <th>
                                                    RESOLVED
                                                </th>

                                                <th>
                                                    CLOSED
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>


                                            {currentAgents.map(
                                                (agent, index) => {

                                                    const rowNumber =
                                                        startIndex +
                                                        index +
                                                        1;


                                                    return (

                                                        <tr
                                                            key={
                                                                agent.agentId
                                                            }
                                                        >


                                                            {/* NUMBER */}

                                                            <td className="agent-number">

                                                                {
                                                                    rowNumber
                                                                }

                                                            </td>


                                                            {/* AGENT */}

                                                            <td>

                                                                <div className="agent-info">


                                                                    <div className="agent-avatar">

                                                                        {agent.agentName
                                                                            ?.charAt(0)
                                                                            ?.toUpperCase()}

                                                                    </div>


                                                                    <div className="agent-details">

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

                                                            </td>


                                                            {/* ASSIGNED */}

                                                            <td>

                                                                <span className="metric-badge assigned">

                                                                    {
                                                                        agent.assignedTickets
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* RESOLVED */}

                                                            <td>

                                                                <span className="metric-badge resolved">

                                                                    {
                                                                        agent.resolvedTickets
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* CLOSED */}

                                                            <td>

                                                                <span className="metric-badge closed">

                                                                    {
                                                                        agent.closedTickets
                                                                    }

                                                                </span>

                                                            </td>


                                                        </tr>

                                                    );
                                                }
                                            )}


                                        </tbody>


                                    </table>


                                </div>


                                {/* =========================
                                    PAGINATION
                                ========================= */}

                                <div className="pagination-section">


                                    {/* ROWS PER PAGE */}

                                    <div className="rows-control">

                                        <span>
                                            Show
                                        </span>


                                        <select
                                            value={
                                                itemsPerPage
                                            }
                                            onChange={
                                                handleItemsPerPageChange
                                            }
                                        >

                                            <option value="5">
                                                5
                                            </option>

                                            <option value="10">
                                                10
                                            </option>

                                            <option value="20">
                                                20
                                            </option>

                                            <option value="50">
                                                50
                                            </option>

                                        </select>


                                        <span>
                                            entries
                                        </span>

                                    </div>


                                    {/* RECORD INFO */}

                                    <div className="pagination-info">

                                        Showing{" "}

                                        <strong>
                                            {startIndex + 1}
                                        </strong>

                                        {" "}to{" "}

                                        <strong>
                                            {Math.min(
                                                endIndex,
                                                agents.length
                                            )}
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {agents.length}
                                        </strong>

                                    </div>


                                    {/* BUTTONS */}

                                    <div className="pagination-buttons">


                                        <button
                                            onClick={
                                                handlePrevious
                                            }
                                            disabled={
                                                currentPage === 1
                                            }
                                        >
                                            Previous
                                        </button>


                                        <span className="page-number">

                                            Page{" "}

                                            <strong>
                                                {currentPage}
                                            </strong>

                                            {" "}of{" "}

                                            <strong>
                                                {totalPages}
                                            </strong>

                                        </span>


                                        <button
                                            onClick={
                                                handleNext
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                        >
                                            Next
                                        </button>


                                    </div>


                                </div>


                            </>
                        )}


                    </section>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <footer className="agents-performance-footer">

                        <span>
                            HELPDESK SAAS
                        </span>

                        <span>
                            AGENT PERFORMANCE
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


export default AgentsPerformance;