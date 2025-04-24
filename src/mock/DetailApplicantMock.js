import CommonContent from '../components/CommonContent';
import { MOCK_MATCH_RESULTS_AP } from './EtoCMockData';

const DetailApplicantMock = () => {
    const mockUser = { name: '홍길동', role: 'APPLICANT' };
    const matchResult = MOCK_MATCH_RESULTS_AP[0]; // 튜토리얼에서는 첫 번째 결과 고정

    return (
        <CommonContent
            matchResult={matchResult}
            role={mockUser.role}
            isMock={true}
        />
    );
};

export default DetailApplicantMock;