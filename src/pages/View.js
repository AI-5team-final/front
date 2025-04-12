import { useParams } from 'react-router-dom';
import useToken from '../hooks/useToken';
import ViewContent from "../components/ViewContent";

const View = () => {
    const { id } = useParams();
    const { role } = useToken();

    return <ViewContent role={role} id={id} />;
}

export default View;