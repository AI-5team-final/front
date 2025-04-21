import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MatchProvider } from "./context/MatchContext";
import { useEffect } from "react";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import List from "./pages/List";
import View from "./pages/View";
import Error from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PanelResume from "./pages/PanelResume";
import PrivateRoute from "./components/PrivateRoute";
import Payment from "./pages/Payment";
import PaySuccess from "./pages/PaySuccess";
import PayFail from "./pages/PayFail";
import CreditDashboard from "./pages/CreditDashboard";
import Matching from "./pages/Matching";
import PanelPosting from "./pages/PanelPosting";
import useAuth from "./hooks/useAuth";
import useAutoRefreshToken from "./hooks/useAutoRefreshToken";
import "the-new-css-reset/css/reset.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/fonts.css";
import "./styles/Style.scss";
import "./styles/modal.scss";

function AppRoutes() {
  useAutoRefreshToken();
  return (
    <Routes>
      {/* 로그인 안하면 전체 막히는 구간 */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Main />} />
        <Route path="list" element={<List />} />
        <Route path="view/:id" element={<View />} />
        <Route path="matching" element={<Matching />} />
        <Route path="resume" element={<PanelResume />} />
        <Route path="postings" element={<PanelPosting />} />
        <Route path="payment" element={<Payment />} />
        <Route path="success" element={<PaySuccess />} />
        <Route path="fail" element={<PayFail />} />
        <Route path="dashboard" element={<CreditDashboard />} />
      </Route>

      {/* 로그인 / 회원가입 / 에러 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

function App() {
  const { initialize } = useAuth();

  // 새로고침 시 상태 복원
  useEffect(() => {
    const { isLoggedIn } = useAuth.getState();
    if (isLoggedIn) {
      initialize();
    } else {
      // 로그인 안했으면 로딩 상태 해제만
      useAuth.setState({ isInitializing: false });
    }
  }, []);

  return (
    <>
      <MatchProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MatchProvider>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        style={{ zIndex: 11002 }}
      />
    </>
  );
}

export default App;
