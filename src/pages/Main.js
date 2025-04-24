import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import MainContent from '../components/MainContent/MainContent';
import useAuth from '../hooks/useAuth';

const Main = () => {
	const { userInfo } = useAuth();
	const role = userInfo?.role;
	const { matchResults, clearResults, setResumeFile, setJobPostFile } = useMatch();
	const location = useLocation();

	useEffect(() => {
		clearResults();
		setResumeFile(null);
		setJobPostFile(null);
		localStorage.setItem("resumeUploaded", "false");
		localStorage.setItem("jobPostFileUploaded", "false");
		localStorage.setItem("isOneToOneMatch", "false");
		localStorage.setItem("oneResumeFile", null);
		localStorage.setItem("oneJobPostFile", null);
	}, [location.pathname]);
	
	useEffect(() => {
		
	}, [matchResults]);
	

	return <MainContent role={role} />;

}

export default Main;