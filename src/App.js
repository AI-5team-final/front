import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import List from "./pages/List";
import View from "./pages/View";
import Error from "./pages/Error";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import "the-new-css-reset/css/reset.css";
import './Style.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인 안하면 전체 막히는 구간 */}
                <Route path="/" element={
                    // <PrivateRoute>
                        <Layout />
                    // </PrivateRoute>
                }>
                    <Route index element={<Main />} />
                    <Route path="list" element={<List />} />
                    <Route path="view/:id" element={<View />} />
                </Route>

                {/* 로그인 */}
                <Route path="/login" element={<Login />} />

                {/* 회원가입 - 개인/기업 role 따라 다르게 */}
                <Route path="/signup" element={<SignUp />} />

                {/* 잘못된 URL */}
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
