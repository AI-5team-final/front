import ListApplicant from "../components/ListApplicant";
import {MOCK_MATCH_RESULTS} from "./EtoCMockData";

const ListApplicantMock = () => {
    const fakeUserInfo = { name: '홍홍홍' };

    return (
        <ListApplicant
            matchResults={MOCK_MATCH_RESULTS}
            userInfo={fakeUserInfo}
            isMock={true}
        />
    );
};

export default ListApplicantMock;
