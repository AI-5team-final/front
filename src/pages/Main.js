import useRole from '../hooks/useRole';
import MainContent from '../components/MainContent';
import './Main.css'

const Main = () => {
	// JWT token에서 role 가져오는 것
	// const role = useRole();

  	// return <MainContent role={role} />;
	
	// 테스트용
	return <MainContent />;
}

export default Main;