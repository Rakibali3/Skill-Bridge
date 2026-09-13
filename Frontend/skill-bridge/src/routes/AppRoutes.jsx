import { Routes, Route } from "react-router-dom";
import SignupPage from "../components/features/auth/pages/SignupPage";
import LandingPage from "../components/pages/LandingPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />

      <Route path="/signup" element={<SignupPage/>} />
    </Routes>
  );
}

export default AppRoutes;
