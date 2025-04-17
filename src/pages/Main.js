import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import MainContent from '../components/MainContent';
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
	}, [location.pathname]);
	
	useEffect(() => {
		// console.log("matchResults가 변경되었습니다:", matchResults);
		// console.log("resumeFileLocal이 변경되었습니다:", localStorage.getItem("resumeFileLocal"));
	  }, [matchResults]);
	

	return <MainContent role={role} />;
}

export default Main;