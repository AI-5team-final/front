import { useMatch } from "../context/MatchContext";
import CommonContent from "./CommonContent";


const MatchingContent = ({ role }) => {
	
	const { matchResults } = useMatch();
	const matchResult = matchResults? matchResults[0] : [];
	
	return(<CommonContent matchResult={matchResult} role={role}/>);
	
};

export default MatchingContent;
