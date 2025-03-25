import { useParams } from "react-router-dom";
import useRole from "../hooks/useRole";
import ViewContent from "../components/ViewContent";

const View = () => {
    const { id } = useParams();  
    const role = useRole();

    return <ViewContent role={role} id={id} />;
}

export default View;