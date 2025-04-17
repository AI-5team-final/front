import { useParams } from "react-router-dom";
import MatchingContent from "../components/MatchingContent";
import useAuth from "../hooks/useAuth";

const Matching = () => {
    const { id } = useParams();
    const { userInfo } = useAuth();
    const role = userInfo?.role;

    return <MatchingContent role={role} id={id} />;
}

export default Matching;