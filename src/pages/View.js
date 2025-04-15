import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useToken from '../hooks/useToken';
import ViewContent from "../components/ViewContent";

const View = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { role } = useToken();
    
    useEffect(() => {
        if (!role) {
            navigate('/login');
        }
    }, [role, navigate]);

    return <ViewContent role={role} id={id} />;
}

export default View;