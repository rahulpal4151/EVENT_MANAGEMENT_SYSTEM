import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import VerifyOtp from "./pages/VerifyOtp";


function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Toaster position="top-center" />

      {/* Navbar yahan aayega */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Protected Routes... */}
        <Route element={<ProtectedRoute allowedRoles={["Organizer"]} />}>
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/create-event" element={<CreateEvent />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Participant"]} />}>
          <Route path="/participant/dashboard" element={<ParticipantDashboard />}/> </Route>

      <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> </Route>
  
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
