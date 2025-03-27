import ContentApplicant from './ContentApplicant';
import ContentHR from './ContentHR';

const MainContent = ({ role }) => {
    if (role === 'HR') {
        return <ContentHR />;
    }
    return <ContentApplicant />;
};

export default MainContent;
