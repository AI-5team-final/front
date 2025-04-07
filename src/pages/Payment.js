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
    const [selected, setSelected] = useState(null); // 선택된 금액
    const [showExtra, setShowExtra] = useState(false); // 기타 펼치기
    const { userInfo } = useUser();

    useEffect(() => {
        loadTossPayments(clientKey)
            .then(tossPayments => {
                const instance = tossPayments.payment({ customerKey });
                setPayment(instance);
            })
            .catch(console.error);
    }, []);

    const presetAmounts = [1000, 3000, 5000, 10000];
    const extraAmounts = [20000, 30000, 50000];

    const handleAmountSelect = (value) => {
        if (value === "기타") {
          setShowExtra(prev => !prev); // 💡 toggle
          setSelected(null); // 선택 초기화
        } else {
          setAmount(String(value));
          setSelected(value);
          setShowExtra(false); // 다른 금액 선택 시 기타는 닫기
        }
      };      

    const handleExtraSelect = (value) => {
        setAmount(String(value));
        setSelected(value);
    };

    const requestPayment = async () => {
        if (!payment) return;

        const numericAmount = parseInt(amount);
        if (!numericAmount || numericAmount < 1000) {
            alert("1,000원 이상의 금액을 입력해주세요");
            return;
        }

        const orderId = "credit_" + uuidv4();

        const paymentOptions = {
            method,
            amount: { value: numericAmount, currency: "KRW" },
            orderId,
            orderName: "크레딧 충전",
            successUrl: window.location.origin + "/success",
            failUrl: window.location.origin + "/fail",
            customerEmail: userInfo?.email,
            customerName: userInfo?.name,
            customerMobilePhone: userInfo?.phone
        };

        try {
            await payment.requestPayment(paymentOptions);
        } catch (err) {
            console.error("결제 요청 실패:", err);
        }
    };

    return (
        <div className="payment-container">
            <h2>크레딧 충전</h2>

            {/* ✍️ 직접 입력 */}
            <input
            type="number"
            placeholder="금액 입력"
            value={amount}
            onChange={(e) => {
                setAmount(e.target.value);
                setSelected(null);
            }}
            style={{ marginBottom: '16px' }} // 약간 여백 추가
            />

            <div className="amount-groups">
            <div className="row first-row">
                {[1000, 3000, 5000, 10000].map((amt) => (
                <button
                    key={amt}
                    className={`price-btn ${selected === amt ? 'selected' : ''}`}
                    onClick={() => handleAmountSelect(amt)}
                >
                    {amt.toLocaleString()}원
                </button>
                ))}
            </div>

            <div className="row single-button-row">
                <button
                className={`price-btn ${showExtra ? 'selected' : ''}`}
                onClick={() => handleAmountSelect("기타")}
                >
                기타금액
                </button>
            </div>

            {showExtra && (
                <div className="row extra-row">
                {[20000, 30000, 50000].map((amt) => (
                    <button
                    key={amt}
                    className={`price-btn ${selected === amt ? 'selected' : ''}`}
                    onClick={() => handleExtraSelect(amt)}
                    >
                    {amt.toLocaleString()}원
                    </button>
                ))}
                </div>
            )}
        </div>

        {/* 구분선 및 결제 수단 안내 문구 */}
        <div className="separator">
            <hr />
            <div className="payment-label">결제 방식</div>
        </div>

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
