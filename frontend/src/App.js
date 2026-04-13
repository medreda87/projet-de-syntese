import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header  from "./Components/Header";
import Footer from "./Components/Footer";
import CookieBanner from "./Components/CookieBanner";
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
import AddLaundryForm from "./Components/AddlaundryForm";




const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        <Header />

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
          <Route path="/admin" element={<AddLaundryForm />} />

          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>

        <Footer />
        <CookieBanner />
      </div>
      
    </ThemeProvider>
  );
};

export default App;
