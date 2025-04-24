import { Link } from "react-router-dom";

const Error = () => {
    return(
        <div className="errorPage">
            <img src="/images/error-404.png" alt="404에러" />
            <Link to="/">홈으로 이동</Link>
        </div>
    );
}

export default Error;