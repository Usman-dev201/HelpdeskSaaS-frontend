import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

import "./Categories.css";

function Categories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(5);


    // =========================
    // LOAD CATEGORIES
    // =========================

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/Dashboard/category-stats"
            );

            setCategories(response.data);

        } catch (err) {

            console.error(
                "Category report error:",
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
                "Unable to load category report."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadCategories();

    }, []);


    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
        categories.length / itemsPerPage
    );


    const startIndex =
        (currentPage - 1) * itemsPerPage;


    const endIndex =
        startIndex + itemsPerPage;


    const currentCategories =
        categories.slice(
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

            <div className="categories-loading">

                <div className="loading-spinner"></div>

                <span>
                    Loading category report...
                </span>

            </div>
        );
    }


    // =========================
    // PAGE
    // =========================

    return (

        <div className="categories-layout">

            <Sidebar />


            <div className="categories-main">

                <Topbar
                    title="Category Report"
                    label="REPORTS"
                />


                <main className="categories-content">


                    {/* =========================
                        PAGE HEADER
                    ========================= */}

                    <div className="categories-heading">

                        <div>

                            <span className="heading-label">
                                TICKET ANALYTICS
                            </span>

                            <h1>
                                Categories
                            </h1>

                            <p>
                                View ticket distribution
                                across all categories.
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

                        <div className="categories-error">

                            <span>!</span>

                            {error}

                        </div>
                    )}


                    {/* =========================
                        REPORT CARD
                    ========================= */}

                    <section className="category-report-card">


                        {/* CARD HEADER */}

                        <div className="report-card-header">

                            <div>

                                <span className="section-label">
                                    CATEGORY REPORT
                                </span>

                                <h2>
                                    Ticket Categories
                                </h2>

                            </div>


                            <div className="total-categories">

                                <span>
                                    TOTAL
                                </span>

                                <strong>
                                    {categories.length}
                                </strong>

                            </div>

                        </div>


                        {/* =========================
                            TABLE
                        ========================= */}

                        {categories.length === 0 ? (

                            <div className="empty-state">

                                No category data
                                available.

                            </div>

                        ) : (

                            <>

                                <div className="category-table-wrapper">

                                    <table className="category-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    #
                                                </th>

                                                <th>
                                                    CATEGORY
                                                </th>

                                                <th>
                                                    TICKETS
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {currentCategories.map(
                                                (category, index) => {

                                                    const rowNumber =
                                                        startIndex +
                                                        index +
                                                        1;

                                                    return (

                                                        <tr
                                                            key={
                                                                category.category
                                                            }
                                                        >

                                                            <td className="category-number">
                                                                {
                                                                    rowNumber
                                                                }
                                                            </td>


                                                            <td>

                                                                <div className="category-name">

                                                                    <div className="category-icon">
                                                                        C
                                                                    </div>

                                                                    <span>
                                                                        {
                                                                            category.category
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <strong className="ticket-count">

                                                                    {
                                                                        category.ticketCount
                                                                    }

                                                                </strong>

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


                                    {/* ITEMS PER PAGE */}

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
                                                categories.length
                                            )}
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {categories.length}
                                        </strong>

                                    </div>


                                    {/* PAGINATION BUTTONS */}

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

                    <footer className="categories-footer">

                        <span>
                            HELPDESK SAAS
                        </span>

                        <span>
                            CATEGORY REPORT
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

export default Categories;