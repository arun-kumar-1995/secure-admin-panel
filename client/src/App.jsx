// import reactLogo from './assets/react.svg'
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Loader } from "./components/Loader/Loader";

// Lazy imports
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
const Login = lazy(() => import("./pages/Login/Login"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp/VerifyOtp"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify-otp/:email" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/access-denied/:ip" element={<Unauthorized />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
