import { useParams } from "react-router-dom";
import { useMatch } from "../context/MatchContext";
import CommonContent from "./CommonContent";



const ViewContent = ({ role }) => {
	
	const { matchResults } = useMatch();
	const { id } = useParams();
	
	const parsedId = parseInt(id);
	const matchResult = matchResults? matchResults[parsedId] : [];

	return(<CommonContent matchResult={matchResult} role={role}/>);
};

export default ViewContent;
