import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import Users from "./pages/Users/Users";
import Categories from "./pages/Categories/Categories";
import AgentsPerformance from "./pages/AgentsPerformance/AgentsPerformance";
import AutoLogout from "./components/AutoLogout/AutoLogout";
function App() {
    return (
        <BrowserRouter>
          <NotificationProvider>
  <AutoLogout />
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
  <Route
        path="/categories"
        element={<Categories />}
    />
    <Route
        path="/agents-performance"
        element={<AgentsPerformance />}
    />
<Route element={<ProtectedRoute />}>
    <Route path="/users" element={<Users />} />
</Route>

                </Route>
            </Routes>
  </NotificationProvider>
        </BrowserRouter>
    );
}

export default App;