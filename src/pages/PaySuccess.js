import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from '../utils/axiosInstance'
import '../styles/Payment.scss';
import useAuth from "../hooks/useAuth";


const PaySuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateCredit } = useAuth();

    const [hasConfirmed, setHasConfirmed] = useState(false); // 중복 호출 방지
    const [message, setMessage] = useState(""); // 백엔드 메시지
    const [receiptUrl, setReceiptUrl] = useState(null); // 영수증 링크

    useEffect(() => {
        if (hasConfirmed) return;

        const confirmPayment = async () => {
            const searchParams = new URLSearchParams(location.search);
            const paymentKey = searchParams.get("paymentKey");
            const orderId = searchParams.get("orderId");
            const amount = searchParams.get("amount");

            try {
                const res = await axiosClient.post("/payments/confirm", {
                    paymentKey,
                    orderId,
                    amount: parseInt(amount),
                });

                // axios는 status code 200~299가 아니면 자동으로 catch로 감
                const { credit, message, receiptUrl, status } = res.data;

                if (credit !== undefined) {
                    updateCredit(credit);
                }

                if (status === "WAITING_FOR_DEPOSIT") {
                    setMessage(message || "가상계좌가 발급되었습니다. 입금 후 결제가 완료됩니다.");
                    setReceiptUrl(receiptUrl);
                    setHasConfirmed(true);
                    return;
                }

                setMessage(message || "결제가 완료되었습니다.");
                setReceiptUrl(receiptUrl);
                setHasConfirmed(true);

            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || "결제 실패";

                if (errorMessage.includes("이미 처리된 결제")) {
                    console.warn("⚠️ 이미 처리된 결제입니다.");
                    setMessage(errorMessage);
                    setHasConfirmed(true);
                } else {
                    console.error("결제 확인 실패:", error);
                    navigate("/fail");
                    reportError({
                        error: JSON.stringify(error, null, 2), // 여기서 문자열화
                        url: "/success"
                    });
                }
            }
        };

        confirmPayment();
    }, [location, navigate, updateCredit, hasConfirmed]);

    return (
        <main className="l-payment">
            <div className="payment-container">
                <h2>✅ 결제 완료</h2>
                <div className="success-box">
                    <p>{message || "크레딧이 정상적으로 충전되었습니다."}</p>
            
                    {receiptUrl && (
                        <p>
                            <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                                🧾 결제 영수증 보기
                            </a>
                        </p>
                    )}
                </div>
            
                <a className="retry-button" href="/">
                    홈으로 돌아가기
                </a>
            </div>
        </main>
    );
};

export default PaySuccess;
