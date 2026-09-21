import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import Users from "./pages/Users/Users";
function App() {
    return (
        <BrowserRouter>

            <Routes>

          
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                   <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                    <Route
    path="/tickets"
    element={<Tickets />}
/>
<Route element={<ProtectedRoute />}>
    <Route path="/users" element={<Users />} />
</Route>
                </Route>
            </Routes>

        </BrowserRouter>
    );
}

export default App;