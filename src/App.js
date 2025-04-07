import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import List from "./pages/List";
import View from "./pages/View";
import Error from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import PanelResume from './components/PanelResume';
import useAutoRefreshToken from './hooks/useAutoRefreshToken';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';
import Payment from './pages/Payment';
import PaySuccess from "./pages/PaySuccess";
import PayFail from "./pages/PayFail";
import "the-new-css-reset/css/reset.css";
import './styles/Style.css';

function AppRoutes() {
  useAutoRefreshToken();

  return (
    <Routes>
      {/* 로그인 안하면 전체 막히는 구간 */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Main />} />
        <Route path="list" element={<List />} />
        <Route path="view/:id" element={<View />} />
        <Route path="resume" element={<PanelResume />} />
        <Route path="payment" element={<Payment />} />
        <Route path="success" element={<PaySuccess />} />
        <Route path="fail" element={<PayFail />} />
      </Route>

      {/* 로그인 / 회원가입 / 에러 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

function App() {
    return (
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <ToastContainer position="top-center" autoClose={2000} />
      </UserProvider>
    );
  }

export default App;
