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
                console.log("값", res.data)

                const { credit, message, receiptUrl, status } = res.data;

            // 크레딧 반영 (승인된 경우만 업데이트됨)
            if (credit !== undefined) {
                updateCredit(credit);
            }

            // 승인 상태에 따라 분기 처리
            if (status === "WAITING_FOR_DEPOSIT") {
                // 가상계좌 입금 대기 상태
                setMessage(message || "가상계좌가 발급되었습니다. 입금 후 결제가 완료됩니다.");
                setReceiptUrl(receiptUrl);
                setHasConfirmed(true);
                return;
            }

            // 정상 승인된 경우
            setMessage(message || "결제가 완료되었습니다.");
            setReceiptUrl(receiptUrl);
            setHasConfirmed(true);

            } catch (error) {
                const errorMessage = error.response?.data?.message || "";

                if (errorMessage.includes("이미 처리된 결제")) {
                    console.warn("⚠️ 이미 처리된 결제입니다.");
                    setMessage(errorMessage);
                    setHasConfirmed(true);
                } else {
                    console.error("결제 확인 실패:", error);
                    navigate("/fail");
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
