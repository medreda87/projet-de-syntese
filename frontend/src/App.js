import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./contexts/AuthContext";
import Header  from "./Components/Header";
import Footer from "./Components/Footer";
import CookieBanner from "./Components/CookieBanner";
import DashboardLayout from "./Dashboard/DashboardLayout";
import Home from "./Pages/Home";
import FindShops from "./Pages/FindShops";
import Services from "./Pages/Services";
import HowItWorks from "./Pages/HowItWorks";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import BecomeProvider from "./Pages/BecomeProvider";
import Terms from "./Pages/Terms";
import Legal from "./Pages/Legal";
import Cookies from "./Pages/Cookies";
import ShopDetail from "./Pages/ShopDetail";
import Checkout from "./Components/Checkout";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import MyOrders from "./Pages/MyOrders";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import AddLaundryForm from "./Components/AddlaundryForm";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminHome from "./Pages/AdminHome";
import AdminUsers from "./Pages/AdminUsers";
import AdminLaundries from "./Pages/AdminLaundries";
import AdminComments from "./Pages/AdminComments";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
};




const App = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        {!isDashboard && <Header />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<FindShops />} />
          <Route path="/shops/:service" element={<FindShops />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/:title" element={<ShopDetail />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="provider">
              <AddLaundryForm />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer orders — requires authentication */}
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          {/* Profile page */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Super admin dashboard — nested routes */}
          <Route path="/superadmin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="laundries" element={<AdminLaundries />} />
            <Route path="comments" element={<AdminComments />} />
          </Route>

          {/* Dashboard — protected, has its own layout (no frontend Header/Footer) */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />

          {/* 404 — must be last */}
          <Route path="*" element={
            <main className="bg-background min-h-screen flex flex-col items-center justify-center px-4 text-center">
              <p className="text-8xl font-black text-[#0C8CE9] mb-4">404</p>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Page not found</h1>
              <p className="text-[#64748B] mb-8">The page you're looking for doesn't exist or has been moved.</p>
              <a href="/" className="px-8 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)' }}>Back to Home</a>
            </main>
          } />
        </Routes>

        {!isDashboard && <Footer />}
        {!isDashboard && <CookieBanner />}
      </div>
    </ThemeProvider>
  );
};

export default App;
