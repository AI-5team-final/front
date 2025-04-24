import ListApplicant from "../components/ListApplicant";
import {MOCK_MATCH_RESULTS_AP} from "./EtoCMockData";

const ListApplicantMock = () => {
    const fakeUserInfo = { name: '홍길동' };

    return (
        <ListApplicant
            matchResults={MOCK_MATCH_RESULTS_AP}
            userInfo={fakeUserInfo}
            isMock={true}
        />
    );
};

export default ListApplicantMock;
