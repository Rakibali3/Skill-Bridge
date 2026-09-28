import { Routes, Route } from "react-router-dom";
import SignupPage from "../components/features/auth/pages/SignupPage";
import LandingPage from "../components/pages/LandingPage";
import LoginPage from "../components/features/auth/pages/LoginPage";
import DashBoard from "../components/pages/DashBoard";
import ProfilePage from "../components/pages/ProfilePage";
import MySkillsPage from "../components/pages/MySkillsPage";
import ProtectedRoute from "./ProtectedRoute";
import FindMatchesPage from "../components/pages/FindMatchesPage";
import UserProfilePage from "../components/pages/UserProfilePage";
import IncomingRequestsPage from "../components/pages/IncomingRequestsPage";
import MyExchangesPage from "../components/pages/MyExchangesPage";
import ExchangeWorkspacePage from "../components/pages/ExchangeWorkspacePage";
import ChatPage from "../components/pages/ChatPage";
import CommunitiesPage from "../components/pages/CommunitiesPage";
import CommunityDetailsPage from "../components/pages/CommunityDetailsPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/signup" element={<SignupPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/my-skills" element={<MySkillsPage />} />
        <Route path="/matches" element={<FindMatchesPage />} />
        <Route path="/requests" element={<IncomingRequestsPage />} />
        <Route path="/exchanges" element={<MyExchangesPage />} />
        <Route path="/exchanges/:exchangeId" element={<ExchangeWorkspacePage />}/>
        <Route path="/messages" element={<ChatPage />} />
        <Route path="/communities" element={<CommunitiesPage />}/>
        <Route path="/communities/:communityId" element={<CommunityDetailsPage />}/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;
