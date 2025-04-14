import { useParams } from "react-router-dom";
import useToken from "../hooks/useToken";
import MatchingContent from "../components/MatchingContent";

const Matching = () => {
    const { id } = useParams();
    const { role } = useToken();

    return <MatchingContent role={role} id={id} />;
}

export default Matching;