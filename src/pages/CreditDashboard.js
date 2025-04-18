import { useEffect, useState, useMemo } from 'react';
import fetchClient from '../utils/fetchClient';
import '../styles/CreditDashboard.scss';
import { handleClientError } from '../utils/handleClientError';

const CreditDashboard = () => {
  const [creditList, setCreditList] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [balance, setBalance] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  // 크레딧 내역 불러오기
  const fetchCreditHistory = async () => {
    try {
      const res = await fetchClient('/payments/credit');

      if(!res.ok){
        const errData = await res.json();
        const err = new Error(errData.message || "크레딧 조회에 실패했습니다.");
        handleClientError({
          error: err,
          toastMessage: "크레딧 조회에 실패했습니다.",
          url: '/payments/credit'
        });
        throw err;
      }


      const data = await res.json();
  
      const creditArray = Array.isArray(data) ? data : data.content || [];
  
      setCreditList(creditArray);
      setBalance(creditArray[0]?.balance || 0);
    } catch (error) {
      handleClientError({
        error: error,
        toastMessage: "크레딧 조회에 실패했습니다.",
        url: '/payments/credit'
      })
    }
  };

  useEffect(() => {
    fetchCreditHistory();
  }, []);

  // 필터 적용된 리스트 계산
  const filteredList = useMemo(() => {
    if (filter === 'ALL') return creditList;
    return creditList.filter(item => item.type === filter);
  }, [creditList, filter]);

  // 필터링된 리스트에서 총 페이지 수 계산
  useEffect(() => {
    setTotalPages(Math.ceil(filteredList.length / size));  // 필터링된 데이터 기준으로 페이지 계산
    setPage(0); // 필터 변경 시 첫 페이지로 이동
  }, [filteredList]);

  // 페이징 처리
  const paginatedList = filteredList.slice(page * size, (page + 1) * size);

  // 필터 변경 시 페이지 초기화
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(0); // 페이지 초기화
  };

  return (
    <main className='l-credit'>
      <div className='inner'>
        <div className="credit-dashboard">
          <div className="header">
            <h2>크레딧 내역</h2>
            <div className="balance">잔액: {balance.toLocaleString()} Credits</div>
          </div>
        
          <div className="filter-tabs">
            <button className={filter === 'ALL' ? 'active' : ''} onClick={() => handleFilterChange('ALL')}>전체 내역</button>
            <button className={filter === 'CHARGE' ? 'active' : ''} onClick={() => handleFilterChange('CHARGE')}>충전 내역</button>
            <button className={filter === 'USE' ? 'active' : ''} onClick={() => handleFilterChange('USE')}>차감 내역</button>
          </div>
        
          <div className="credit-list">
            {paginatedList.map((item, idx) => (
              <div className="credit-item" key={idx}>
                <div className="title">
                  {item.type === 'CHARGE'
                    ? '크레딧 충전'
                    : item.type === 'USE'
                    ? '서비스 이용'
                    : item.type === 'WELCOME'
                    ? '🎁 가입 축하 크레딧'
                    : '기타'}
                </div>
        
                {item.type !== 'WELCOME' && (
                  <div className="date">
                    {new Date(item.approvedAt).toLocaleString()}
                  </div>
                )}
        
                <div className={`amount ${item.type === 'CHARGE' || item.type === 'WELCOME' ? 'plus' : 'minus'}`}>
                  {(item.type === 'CHARGE' || item.type === 'WELCOME') ? '+' : '-'}
                  {item.amount.toLocaleString()} Credits
                </div>
              </div>
            ))}
            {paginatedList.length === 0 && <p className="empty">내역이 없습니다.</p>}
          </div>
        
          {/* 📄 페이지 버튼 */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={page === i ? 'active' : ''}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreditDashboard;
