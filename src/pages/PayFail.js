import { useLocation } from "react-router-dom";
import '../styles/Payment.scss';

const PayFail = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
        <div className="payment-container">
            <h2>❌ 결제 실패</h2>
            <div className="error-box">
                <p><strong>에러 코드:</strong> {code}</p>
                <p><strong>메시지:</strong> {message}</p>
            </div>
            <a className="retry-button" href="/payment">
                ← 결제 페이지로 돌아가기
            </a>
        </div>
    );
};

export default PayFail;
