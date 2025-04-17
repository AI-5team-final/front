import { useParams } from 'react-router-dom';
import ViewContent from "../components/ViewContent";
import "../styles/CommonContent.scss";
import useAuth from '../hooks/useAuth';

const View = () => {
    const { id } = useParams();
    const {userInfo} = useAuth();
    const role = userInfo?.role;

    return <ViewContent role={role} id={id} />;
}

export default View;