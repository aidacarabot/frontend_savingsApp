import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Goals from "../pages/Goals";
import Overview from '../pages/Overview'
import Transactions from "../pages/Transactions";
import User from "../pages/User";
import Navbar from "../components/Navbar/Navbar";
import LoginForm from "../components/LoginForm/LoginForm";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
    const location = useLocation();

  //? Condición para no mostrar el Navbar en Login, Register y '/'
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register';

    return (
    <>
      {showNavbar && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/overview" element={<Overview />} />
            <Route path="/user" element={<User />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default AppRouter;