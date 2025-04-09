import '../styles/AgentUsageButton.scss';
import { useState } from 'react';
import fetchClient from '../utils/fetchClient';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const AgentUsageButton = () => {
  const [loading, setLoading] = useState(false);
  const { updateCredit } = useUser();

  const handleUseAgent = async () => {
    setLoading(true);
    try {
      const res = await fetchClient('/payments/credit', { method: 'POST' });

      if (res.ok) {
        const data = await res.json();
        updateCredit(data.balance);
        toast.success('✅ 에이전트 사용 완료! 크레딧이 차감되었습니다.');
      } else if (res.status === 400) {
        toast.error('❌ 크레딧이 부족합니다.');
      } else {
        toast.error('⚠️ 에이전트 사용 중 오류 발생');
      }
    } catch (err) {
      console.error('❌ 요청 실패:', err);
      toast.error('⚠️ 서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="agent-use-button"
      onClick={handleUseAgent}
      disabled={loading}
    >
      {loading ? '처리 중...' : '에이전트 사용하기 (₩500 차감)'}
    </button>
  );
};

export default AgentUsageButton;
