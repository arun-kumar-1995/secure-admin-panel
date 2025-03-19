// import reactLogo from './assets/react.svg'
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Loader } from "./components/Loader/Loader";

// Lazy imports
const Home = lazy(() => import("./pages/Home/Home"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
