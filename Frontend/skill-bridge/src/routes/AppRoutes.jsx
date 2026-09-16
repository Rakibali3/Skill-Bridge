import { Routes, Route } from "react-router-dom";
import SignupPage from "../components/features/auth/pages/SignupPage";
import LandingPage from "../components/pages/LandingPage";
import LoginPage from "../components/features/auth/pages/LoginPage";
import DashBoard from "../components/pages/DashBoard";
import ProfilePage from "../components/pages/ProfilePage";
import MySkillsPage from "../components/pages/MySkillsPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />

      <Route path="/signup" element={<SignupPage/>} />

      <Route path="/login" element={<LoginPage/>} />

      <Route path="/dashboard" element={<DashBoard/>} />

      <Route path="/profile" element={<ProfilePage/>} />

      <Route path="/my-skills" element={<MySkillsPage/>} />

    </Routes>
  );
}

export default AppRoutes;
