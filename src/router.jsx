import { BrowserRouter, Route, Routes } from "react-router-dom";
import Goals from "./pages/Goals";
import Overview from './pages/Overview'
import LoginRegister from "./pages/LoginRegister";
import Transactions from "./pages/Transactions";
import User from "./pages/User";
import Navbar from "./components/Navbar/Navbar";



const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/user" element={<User />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default AppRouter;