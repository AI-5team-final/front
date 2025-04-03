import { v4 as uuidv4 } from 'uuid';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import '../styles/Payment.scss';

const clientKey = "test_ck_P9BRQmyarYBweLQwgG778J07KzLN";
const customerKey = "V97Io7HRQ1c3bzDqnpcCk";

const Payment = () => {
    const [payment, setPayment] = useState(null);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("CARD");
    const { userInfo } = useUser();

    useEffect(() => {
        loadTossPayments(clientKey)
            .then(tossPayments => {
                const instance = tossPayments.payment({ customerKey });
                setPayment(instance);
            })
            .catch(console.error);
    }, []);

    const requestPayment = async () => {
        if (!payment) return;

        const numericAmount = parseInt(amount);
        if (!numericAmount || numericAmount < 1000) {
            alert("1,000원 이상의 금액을 입력해주세요");
            return;
        }

        const orderId = "credit_" + uuidv4();

        // 기본 결제 옵션
        const paymentOptions = {
            method,
            amount: {
                value: numericAmount,
                currency: "KRW"
            },
            orderId,
            orderName: "크레딧 충전",
            successUrl: window.location.origin + "/success",
            failUrl: window.location.origin + "/fail",
            customerEmail: userInfo?.email,
            customerName: userInfo?.name,
            customerMobilePhone: userInfo?.phone
        };

        // method에 따라 옵션 분기 추가
        if (method === "CARD") {
            paymentOptions.card = {
                useEscrow: false,
                flowMode: "DEFAULT",
                useCardPoint: false,
                useAppCardOnly: false,
            };
        } else if (method === "VIRTUAL_ACCOUNT") {
            paymentOptions.virtualAccount = {
                cashReceipt: {
                    type: "소득공제",
                },
                useEscrow: false,
                validHours: 24,
            };
        } else if (method === "TRANSFER") {
            paymentOptions.transfer = {
                cashReceipt: {
                    type: "소득공제",
                },
                useEscrow: false,
            };
        }

        try {
            await payment.requestPayment(paymentOptions);
        } catch (err) {
            console.error("결제 요청 실패:", err);
        }
    };

    return (
        <div className="payment-container">
            <h2>크레딧 충전</h2>

            <input
                type="number"
                placeholder="충전할 금액 입력 (ex. 5000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <select onChange={(e) => setMethod(e.target.value)} value={method}>
                <option value="CARD">카드결제</option>
                <option value="VIRTUAL_ACCOUNT">가상계좌</option>
                <option value="MOBILE_PHONE">휴대폰 결제</option>
                <option value="TRANSFER">계좌이체</option>
            </select>

            <button onClick={requestPayment} style={{ marginTop: "10px" }}>
                🔋 충전하기
            </button>
        </div>
    );
};

export default Payment;
