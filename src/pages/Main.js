import { useEffect } from 'react';
import MainContent from '../components/MainContent';
import useToken from '../hooks/useToken';
import { useMatch } from '../context/MatchContext';
import { useLocation } from 'react-router-dom';

const Main = () => {
	const { role } = useToken();
	const { matchResults, clearResults } = useMatch();
	const location = useLocation();

	useEffect(() => {
		clearResults();
	}, [location.pathname]);
	
	useEffect(() => {
		console.log("matchResults가 변경되었습니다:", matchResults);
	  }, [matchResults]);
	

	return <MainContent role={role} />;
}

export default Main;