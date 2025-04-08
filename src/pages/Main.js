import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainContent from '../components/MainContent';
import useToken from '../hooks/useToken';
import '../styles/Main.scss'

const Main = () => {
	const navigate = useNavigate();
	const { role } = useToken();
	
	useEffect(() => {
		if (!role) {
			navigate('/login');
		}
	}, [role, navigate]);

	return <MainContent role={role} />;
}

export default Main;